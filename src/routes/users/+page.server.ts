import type { PageServerLoad, Actions } from './$types'; 
import { db } from '$lib/server/db'; import { users } from '$lib/server/db/schema'; 
import { fail } from '@sveltejs/kit'; import { desc } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

export const load: PageServerLoad = async () => { 
    try { 
        const allUsers = await db
            .select()
            .from(users)
            .orderBy(desc(users.id))
            .all(); 
        return { users: allUsers }; 
    } 
    catch (e) { 
        return { 
            users: [], 
            error: "Gagal memuat data" }; 
        } 
    };

export const actions: Actions = { 
    create: async ({ request }) => { 
        const formData = await request.formData(); 
        const username = formData.get('username')?.toString(); 
        const password = formData.get('password')?.toString(); 
        const role = formData.get('role')?.toString(); 
        const hp = formData.get('hp')?.toString();

        if (!username || !password) {
            return fail(400, { message: "Data tidak lengkap" });
        }
        const hashedPassword = await hash(password, {
            // Konfigurasi default argon2 biasanya sudah sangat aman
            memoryCost: 65536,
            timeCost: 3,
            outputLen: 32,
            parallelism: 4
        });
        try {
            await db.insert(users).values({
                username,
                passwordHash: hashedPassword, 
                role: role || 'user',
                hp: hp || null
            });
            return { success: true };
        } catch (e) {
            return fail(500, { message: "Database error" });
        }
    }
};