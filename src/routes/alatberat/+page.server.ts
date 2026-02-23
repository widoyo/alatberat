import type { PageServerLoad, Actions } from './$types'; 
import { db } from '$lib/server/db'; import { users } from '$lib/server/db/schema'; 
import { fail } from '@sveltejs/kit'; import { eq, desc } from 'drizzle-orm';
import { aset } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => { 
    try { 
        const allAset = await db
            .select()
            .from(aset)
            .where(eq(aset.kategoriAset, "alat berat"))
            .orderBy(desc(aset.id)).all(); 
        return { asets: allAset }; 
    } 
    catch (e) { 
        return { 
            asets: [], 
            error: "Gagal memuat data" }; 
        } 
    };

export const actions = {
    add: async ({ request }) => {
        const data = await request.formData();
        const nama = data.get('nama');

        if (!nama || nama.length < 3) {
            return fail(400, { 
                error: true, 
                message: 'Nama operator terlalu pendek',
                values: { nama } // Kirim balik agar input tidak hilang
            });
        }

        try {
            // Logika simpan ke Drizzle...
            return { success: true, message: 'Operator berhasil ditambah' };
        } catch (e) {
            return fail(500, { error: true, message: 'Gagal menyimpan ke database' });
        }
    }
};