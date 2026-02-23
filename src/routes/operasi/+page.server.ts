import { aset } from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { eq, desc, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {

    const penggunaan = await db
        .query
        .penggunaanAset
        .findMany({
            where: (penggunaanAset, { isNull }) => isNull(penggunaanAset.tanggalSelesai),
        });
	return {
		penggunaan: penggunaan
	};
};

export const actions = {
	add: async (event) => {
		const user = event.locals.user;
        console.log('User adding operasi:', user);

        const formData = await event.request.formData();
        const nup = formData.get('nup');
        const tanggalMulai = formData.get('tanggalMulai');
        const tanggalSelesai = formData.get('tanggalSelesai');
        const lokasi = formData.get('lokasi');
        const pekerjaan = formData.get('pekerjaan');
        const operatorId = formData.get('operatorId');
        console.log('Form Data:', { nup, tanggalMulai, tanggalSelesai, lokasi, pekerjaan, operatorId });
	}
} satisfies Actions;