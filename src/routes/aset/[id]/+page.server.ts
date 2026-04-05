// src/routes/p/[noLambung]/+page.server.ts
import { db } from '$lib/server/db';
import { aset, penggunaanAset, pemeliharaanAlat, operator, bahanBakar } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export const load = async ({ params, locals }) => {
    const unit = await db.select().from(aset).where(eq(aset.id, params.id)).get();

    if (!unit) throw error(404, "Unit tidak ditemukan");

    const logs = await db.select().from(penggunaanAset).where(eq(penggunaanAset.asetId, unit.id));

    // Jika BUKAN admin kantor, hapus data harga sebelum dikirim ke UI
    const serviceHistory = await db.select().from(pemeliharaanAlat).where(eq(pemeliharaanAlat.asetId, unit.id));
    const operators = await db.select().from(operator).all();
    if (!locals.user) {
        // Mode Publik: Mapping ulang untuk menghilangkan info biaya
        return {
            unit,
            logs,
            service: serviceHistory.map(s => ({
                tanggal: s.tanggal,
                deskripsi: s.deskripsiPekerjaan // Harga Jasa disembunyikan
            }))
        };
    }

    return { unit, logs, operators, service: serviceHistory }; // Mode Admin: Data penuh
};

export const actions: Actions = {
    createUsage: async ({ request, params }) => {
        console.log("Create usage action triggered for unit ID: ", params.id);
        const formData = await request.formData();

        // Ambil data dari form
        const pengguna = formData.get('pengguna')?.toString();
        const pic = formData.get('pic')?.toString();
        const operatorId = formData.get('operatorId')?.toString();
        const proyek = formData.get('proyek')?.toString();
        const intern = formData.get('intern') === 'on'; // Checkbox di HTML nilainya 'on'
        const tanggalMulai = formData.get('tanggalMulai')?.toString();
        const tanggalSelesai = formData.get('tanggalSelesai')?.toString();
        const asetId = formData.get('asetId')?.toString();

        // Validasi Sederhana
        if (!pengguna || !pic || !operatorId || !tanggalMulai) {
            return fail(400, {
                error: 'Data wajib diisi semua (Pengguna, PIC, Operator, & Tgl Mulai)',
                values: { pengguna, pic, proyek, intern }
            });
        }

        try {
            await db.insert(penggunaanAset).values({
                asetId: Number(asetId),
                pengguna,
                pic,
                operatorId: Number(operatorId),
                proyek,
                intern,
                // Pastikan format tanggal sesuai dengan kolom DB Anda (Date atau String)
                tglMulai: new Date(tanggalMulai),
                tglSelesai: tanggalSelesai ? new Date(tanggalSelesai) : null,
            });
        } catch (err) {
            console.error(err);
            return fail(500, { error: 'Gagal menyimpan ke database' });
        }

        // Opsional: Redirect atau biarkan reload untuk update list
        //throw redirect(303, `/aset/${params.id}`);
    },

    createBbm: async ({ request, locals }) => {
        console.log("Create BBM action triggered");
        const formData = await request.formData();

        const asetId = Number(formData.get('asetId'));
        const tanggal = formData.get('tanggal')?.toString();
        const liter = formData.get('liter')?.toString();
        const harga = formData.get('harga')?.toString();

        if (!asetId || !tanggal || !liter) {
            return fail(400, { message: 'Data BBM tidak lengkap' });
        }

        try {
            await db.insert(bahanBakar).values({
                asetId,
                // Mengonversi tanggal string (YYYY-MM-DD) ke Unix Timestamp (Seconds)
                tanggalPengisian: Math.floor(new Date(tanggal).getTime() / 1000),
                jumlahLiter: liter,
                biaya: harga || "0",
                // createdBy: locals.user?.id // Jika Anda sudah punya sistem auth
            });
            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Gagal menyimpan data BBM' });
        }
    },

    // Action untuk menyimpan Pemeliharaan
    createService: async ({ request, locals }) => {
        console.log("Create service action triggered");
        const formData = await request.formData();

        const asetId = Number(formData.get('asetId'));
        const tanggal = formData.get('tanggal')?.toString();
        const jenis = formData.get('jenisPemeliharaan')?.toString();
        const deskripsi = formData.get('deskripsiPekerjaan')?.toString();

        if (!asetId || !tanggal || !jenis) {
            return fail(400, { message: 'Data Pemeliharaan tidak lengkap' });
        }

        try {
            await db.insert(pemeliharaanAlat).values({
                asetId,
                tanggal: Math.floor(new Date(tanggal).getTime() / 1000),
                jenisPemeliharaan: jenis,
                deskripsiPekerjaan: deskripsi,
                // createdBy: locals.user?.id
            });
            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Gagal menyimpan data pemeliharaan' });
        }
    }
};
