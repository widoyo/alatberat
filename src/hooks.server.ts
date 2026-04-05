import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq, and, gt } from 'drizzle-orm';
import { operator } from '$lib/server/db/schema';

export const handle: Handle = async ({ event, resolve }) => {
    const pathname = event.url.pathname;
    
    // 1. Identifikasi Jalur (Gunakan regex agar /operator tidak terkena)
    const isOpRoute = /^\/op($|[\/?])/.test(pathname);

    // 2. Track Operator (Lapangan)
    const opPin = event.cookies.get('op_pin_session');
    if (opPin) {
        const [activeOp] = await db
            .select()
            .from(operator)
            .where(
                and(
                    eq(operator.token, opPin),
                    gt(operator.tokenExpiresAt, new Date())
                )
            )
            .limit(1);

        if (activeOp) {
            event.locals.operator = {
                id: activeOp.id,
                panggilan: activeOp.panggilan,
            };
            
            // Redirect HANYA jika mencoba akses root '/' saat sesi OP aktif
            if (pathname === '/' && !isOpRoute) {
                return new Response(null, { status: 302, headers: { Location: '/op' } });
            }
        } else {
            event.cookies.delete('op_pin_session', { path: '/' });
            event.locals.operator = null;
        }
    }

    // 3. Track User (Kantor - Lucia)
    const sessionToken = event.cookies.get(auth.sessionCookieName);
    if (!sessionToken) {
        event.locals.user = null;
        event.locals.session = null;
    } else {
        const { session, user } = await auth.validateSessionToken(sessionToken);
        if (session) {
            auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
            event.locals.user = user;
            event.locals.session = session;
        } else {
            auth.deleteSessionTokenCookie(event);
            event.locals.user = null;
            event.locals.session = null;
        }
    }

    return resolve(event);
};