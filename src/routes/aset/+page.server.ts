import { db } from '$lib/server/db';
import { aset } from '$lib/server/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    return {
        // Hanya ambil yang belum di-'delete' secara soft
        daftarAset: await db.select().from(aset).where(isNull(aset.deletedAt))
    };
};

export const actions = {
    // Satu aksi untuk Tambah & Update (Upsert)
    upsert: async ({ request, locals }) => {
        const data = Object.fromEntries(await request.formData());
        const id = data.id ? Number(data.id) : null;
        const kategoriAset = data.kategoriAset?.toString().trim();

        if (!kategoriAset || kategoriAset === "") {
            return fail(400, { 
                error: "Kategori Aset wajib dipilih.", 
                missingKategori: true,
                values: data // Kembalikan input agar user tidak perlu mengetik ulang
            });
        }
        const payload = {
            nup: data.nup,
            kategoriAset: data.kategoriAset,
            noLambung: data.noLambung,
            workHour: Number(data.workHour),
            volBahanbakar: Number(data.volBahanbakar),
            // ... field lainnya
            createdBy: locals.user?.id
        };

        if (id) {
            await db.update(aset).set(payload).where(eq(aset.id, id));
        } else {
            await db.insert(aset).values(payload);
        }
    },

    // Update atomik per field (Sangat praktis untuk HM/BBM di lapangan)
    patch: async ({ request }) => {
        const data = Object.fromEntries(await request.formData());
        const id = Number(data.id);
        const field = String(data.field);
        const value = data.value;

        await db.update(aset).set({ [field]: value }).where(eq(aset.id, id));
        return { success: true };
    },

    delete: async ({ request }) => {
        const id = Number((await request.formData()).get('id'));
        // Soft delete: cukup isi deletedAt
        await db.update(aset).set({ deletedAt: Date.now() }).where(eq(aset.id, id));
    }
};