import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

/** * Menghasilkan token acak untuk Session Kantor 
 */
export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    return encodeBase64url(bytes);
}

/** * Membuat sesi baru di tabel 'session' 
 */
export async function createSession(token: string, userId: string) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: typeof table.session.$inferInsert = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
    };
    await db.insert(table.session).values(session);
    return session;
}

/** * Validasi Session Token dari Cookie (Join ke tabel users)
 */
export async function validateSessionToken(token: string) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const [result] = await db
        .select({
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

    // Cek Expiry
    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(table.session).where(eq(table.session.id, session.id));
        return { session: null, user: null };
    }

    // Perpanjangan otomatis jika masa berlaku tinggal setengah (15 hari)
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

export function invalidateSession(sessionId: string) {
    return db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
    event.cookies.set(sessionCookieName, token, {
        expires: expiresAt,
        path: '/'
    });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
    event.cookies.delete(sessionCookieName, { path: '/' });
}