import { aset, users, penggunaanAset } from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from './$types'; 
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db'; 
import { fail, redirect } from '@sveltejs/kit'; 
import { desc, eq, isNull, and } from 'drizzle-orm';
import { asetService } from '$lib/server/db/services/aset';


export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
};

export const load: PageServerLoad = async () => { 
    try { 
        const alatOnDuty = await asetService.getAlatBeratOnDuty();
        
        const alatStandby = await asetService.getAlatBeratOnIdle();

        const allOperator = await db
            .select()
            .from(users)
            .where(eq(users.role, "operator"))
            .orderBy(desc(users.username))
            .all();
        return { alatBeratOnDuty: alatOnDuty, operators: allOperator, alatBeratStandby: alatStandby }; 
    } 
    catch (e) { 
        return { 
            operators: [],
            alatBeratStandby: [],
            alatBeratOnDuty: [],
            error: "Gagal memuat data" }; 
        } 
    };