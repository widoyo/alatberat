import { operator } from "$lib/server/db/schema";
import type { PageServerLoad } from './$types'; 
import { db } from '$lib/server/db'; 
import { fail } from '@sveltejs/kit'; 
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => { 
    try { 
        const allOperator = await db
            .select()
            .from(operator)
            .orderBy(desc(operator.id))
            .all(); 
        return { operators: allOperator }; 
    } 
    catch (e) { 
        return { 
            operators: [], 
            error: "Gagal memuat data" }; 
        } 
    };