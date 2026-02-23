import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { eq, and, gt } from 'drizzle-orm';
import { aktifitasAlat, aset, asetRuntime, operator } from '$lib/server/db/schema';
import crypto from 'node:crypto';

// Skema validasi yang teguh
const otpSchema = z.object({
    otp: z.string().length(4, "Kode harus tepat 4 digit").regex(/^\d+$/, "Hanya angka diperbolehkan")
});

export const load = async ({ cookies }) => {
    const hashed_id = cookies.get('op_id');
    if (hashed_id) {
        const sevenDaysAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
        const currOperator = await db.query.operator.findFirst({
            where: (operator, {eq}) => eq(operator.hashedSession, hashed_id),
            columns: {
                hashedSession: false,
                token: false,
                tokenExpiresAt: false,
                id: false,
                deletedAt: false
            },
            with: {
                aktifitas: {
                    where: (aktifitas, { gte }) => gte(aktifitas.waktuMulai, sevenDaysAgo),
                    orderBy: (aktifias, { desc }) => [desc(aktifitasAlat.waktuMulai)],
                    columns: {
                        waktuMulai: true,
                        akhirHm: true,
                        deskripsiAktifitas: true
                    }
                }
            }
        });
        const isAuthorized = (currOperator ? true : false);
        return {
            isAuthorized: isAuthorized,
            operator: currOperator
        }

    }
    return {
        isAuthorized: false,
        operator: {}
    }
};

export const actions: Actions = {
    verifyOtp: async ({request, cookies}) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        // Validasi dengan Zod
        const result = otpSchema.safeParse(data);

        if (!result.success) {
            return fail(400, { 
                error: result.error.flatten().fieldErrors.otp?.[0],
                values: data 
            });
        }

        const validOtp = result.data.otp;

        // Simulasi pengecekan database SQLite nanti

// 1. Ambil data operator berdasarkan token
        // Kita juga cek tokenExpiresAt harus lebih besar dari waktu sekarang (gt = greater than)
        const currOperator = await db.query.operator.findFirst({
            where: (operator, {eq}) => eq(operator.hashedSession, validOtp),
            columns: {
                hashedSession: false,
                token: false
            }

        });

        // 2. Jika tidak ditemukan atau token basi
        if (!currOperator) {
            return fail(401, { 
                error: "KODE TIDAK VALID ATAU SUDAH EXPIRED",
                otp: "" 
            });
        }

        // 3. Update masa aktif sesi (misal: perpanjang 12 jam dari sekarang)
        // Ini agar operator tidak perlu input OTP setiap 5 menit
        const newExpiry = new Date(Date.now() + 1000 * 60 * 60 * 12);
        const hashedSession = crypto.createHash('sha256').update(String(currOperator.id)).digest('hex');
        await db.update(operator)
            .set({ 
                tokenExpiresAt: newExpiry,
                hashedSession: hashedSession
            })
            .where(eq(operator.id, currOperator.id));

        // 4. Pasang Cookie 'op_id' (Tanpa Lucia, sesuai rencana kita)
        cookies.set('op_id', hashedSession, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            expires: newExpiry
        });

        // 5. Lempar ke Dashboard
        throw redirect(303, '/op');
    },
    logout: async (event) => {
        const opId = event.cookies.get('op_id');

        if (opId) {
            // "Slow and Low": Matikan token di DB agar tidak bisa dipakai lagi
            await db.update(operator)
                .set({ 
                    tokenExpiresAt: new Date(0), // Set ke masa lalu (1970)
                })
                .where(eq(operator.id, Number(opId)));
        }

        // Hapus cookie dari browser
        event.cookies.delete('op_id', { path: '/' });

        // Lempar kembali ke halaman login/OTP
        throw redirect(303, '/op');
    }
};