import type { PageServerLoad, Actions } from './$types'; 
import { fail } from '@sveltejs/kit'; import { eq, desc } from 'drizzle-orm';
import { asetService } from "$lib/server/db/services/aset";

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