import { db } from '$lib/server/db';
import { operator } from '$lib/server/db/schema';
import { eq, sql, and, isNull, gt } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

async function createHash(text: string) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}

export const load = async ({ cookies, request }) => {
    const sessionCookie = cookies.get('op_pin_session');
    if (!sessionCookie) return { authenticated: false };

    // Verifikasi Session ke Database
    const user = await db.query.operator.findFirst({
        where: and(
            eq(operator.hashedSession, sessionCookie),
            // Cek apakah belum melewati jam 24:00 hari ini
            gt(operator.tokenExpiresAt, new Date())
        )
    });

    if (!user) return { authenticated: false };

    return { 
        authenticated: true, 
        profile: { nama: user.nama, panggilan: user.panggilan } 
    };
};

export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const inputPin = data.get('pin') as string; // Contoh: "56781"
        const userAgent = request.headers.get('user-agent') || '';

        // Query: Cari 4 digit terakhir WA + 1 digit Token
        const result = await db.select()
            .from(operator)
            .where(
                and(
                    eq(operator.token, String(inputPin)), // Cek digit terakhir sebagai token
                    eq(operator.status, 'aktif'),
                    isNull(operator.deletedAt)
                )
            )
            .limit(1);
        console.log("Database query result for PIN: ", inputPin, " - Result: ", result);
        const found = result[0];
        console.log("Login attempt with PIN: ", inputPin, " - Found user: ", found ? found.nama : "None");
        if (!found) {
            return fail(401, { message: 'PIN salah atau akses ditolak' });
        }

        // Buat Hash Sesi (PIN + Secret + UserAgent)
        const secret = env.OP_SECRET_KEY || 'default_secret';
        const sessionHash = await createHash(`${inputPin}-${secret}-${userAgent}`);

        // Update ke Database
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);

        await db.update(operator)
            .set({ 
                hashedSession: sessionHash,
                tokenExpiresAt: midnight
            })
            .where(eq(operator.id, found.id));

        // Set Cookie
        const maxAge = Math.floor((midnight.getTime() - Date.now()) / 1000);
        cookies.set('op_pin_session', sessionHash, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: maxAge
        });

        return { authenticated: true, success: true };
    },

    logout: async ({ cookies }) => {
        cookies.delete('op_pin_session', { path: '/' });
        throw redirect(303, '/op');
    }
};