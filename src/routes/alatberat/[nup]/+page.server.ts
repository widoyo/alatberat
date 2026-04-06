import type { PageServerLoad, Actions } from './$types'; 
import { fail } from '@sveltejs/kit'; import { eq, desc } from 'drizzle-orm';
import { asetService } from "$lib/server/db/services/aset";
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => { 
    try { 
        const alatberat = await asetService.getDetailByNup(event.params.nup);
        return { alatberat: alatberat }; 
    } 
    catch (e) { 
        return { 
            alatberat: undefined, 
            error: "Gagal memuat data" }; 
        } 
    };

export const actions: Actions = {
    booking: async (event) => {
        console.log("Booking action triggered for NUP: ", event.params.nup);
        const formData = await event.request.formData();
        const pengguna = formData.get('pengguna') as string;
        const pic = formData.get('pic') as string;
        const lokasi = formData.get('lokasi') as string;
        const tanggalMulai = formData.get('tanggalMulai') as string;
        const tanggalSelesai = formData.get('tanggalSelesai') as string;
        console.log("Received booking data: ", { pengguna, pic, lokasi, tanggalMulai, tanggalSelesai });
        // Validasi input
        if (!pengguna || !tanggalMulai) {
            return fail(400, { message: 'Semua field harus diisi' });
        }
        console.log("Booking request received: ", { pengguna, pic, lokasi, tanggalMulai, tanggalSelesai });
    },
};