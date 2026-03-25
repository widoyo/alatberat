import type { RequestEvent } from '@sveltejs/kit';
import type { InferInsertModel } from 'drizzle-orm';
import { eq, isNotNull } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';
type Session = InferInsertModel<typeof table.session>;
type SessionPin = {expiresAt: Date};

export async function generateUniquePin(): Promise<string> {
    // Ambil semua token yang sudah terpakai
    const existing = await db.select({ token: table.operator.token })
        .from(table.operator)
        .where(isNotNull(table.operator.token));
    
    const usedPins = new Set(existing.map(o => o.token));

    let pin = "";
    while (true) {
        pin = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        if (!usedPins.has(pin)) break; 
    }

    return pin;
}

export async function updateSessionPin(pin: string, operatorId: number): Promise<SessionPin> {
    const sessionPin = {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    };

    await db.update(table.operator).set(sessionPin).where(eq(table.operator.id, operatorId));
    return sessionPin;
}

export async function createSession(token: string, userId: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    
    const session: Session = {
        id: sessionId,
        userId,
        // Svelte/Drizzle butuh Date object untuk timestamp di SQLite (mode: timestamp)
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) 
    };

    await db.insert(table.session).values(session);
    return session;
}

export async function validateSessionPin(pin: string) {}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { id: table.users.id, username: table.users.username },
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.users, eq(table.session.userId, table.users.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
