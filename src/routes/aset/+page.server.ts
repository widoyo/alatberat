import type { PageServerLoad, Actions } from './$types'; 
import { db } from '$lib/server/db'; import { users } from '$lib/server/db/schema'; 
import { fail } from '@sveltejs/kit'; import { desc } from 'drizzle-orm';
import { aset } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => { 
    try { 
        const allAset = await db.select().from(aset).orderBy(desc(aset.id)).all(); 
        return { asets: allAset }; 
    } 
    catch (e) { 
        return { 
            asets: [], 
            error: "Gagal memuat data" }; 
        } 
    };