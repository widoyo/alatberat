import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { aset } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	try {
		const allAset = await db
			.select()
			.from(aset)
			.where(eq(aset.kategoriAset, 'alat berat'))
			.orderBy(desc(aset.id))
			.all();
		return { asets: allAset };
	} catch (e) {
		console.error(e);
		return {
			asets: [],
			error: 'Gagal memuat data aset dari database.'
		};
	}
};

export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const deskripsi = data.get('deskripsi');
		const tipe = data.get('tipe');

		if (!deskripsi || String(deskripsi).length < 3) {
			return fail(400, {
				error: true,
				message: 'Deskripsi aset terlalu pendek'
			});
		}

		try {
			// Ganti dengan skema Drizzle Anda
			// await db.insert(aset).values({ deskripsi, tipe, kategoriAset: 'alat berat', ... });
			return { success: true, message: 'Alat berat berhasil didaftarkan' };
		} catch (e) {
			return fail(500, { error: true, message: 'Gagal menyimpan ke database' });
		}
	}
};