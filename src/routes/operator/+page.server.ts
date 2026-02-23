import { asetRuntime, operator, aset } from "$lib/server/db/schema";
import type { PageServerLoad, Actions } from './$types'; 
import { db } from '$lib/server/db'; 
import { fail } from '@sveltejs/kit'; 
import { desc, eq } from 'drizzle-orm';


export const actions = {
    add: async (event) => {
        const data = await event.request.formData();
        const nama = data.get('nama')?.toString();
        const whatsapp = data.get('whatsapp')?.toString();
        const lisensi = data.get('lisensi')?.toString();

        if (!nama) {
            return fail(400, {
                errors: { nama: "Nama lengkap wajib diisi" },
                values: { nama, whatsapp, lisensi }
            })
        }

        const existingOperator = await db.query.operator.findFirst({
            where: eq(operator.nama, nama)
        });

        if (existingOperator) {
            return fail(400, {
                errors: { nama: 'Nama sudah terdaftar di sistem' },
                values: { nama, whatsapp }
            });
        }

        await db.insert(operator).values({ nama, whatsapp, lisensi });
        
        console.log("nama: ", nama);
        return { success: true };
    }
} satisfies Actions

export const load: PageServerLoad = async () => { 
    try { 
        const allOperator = await db
            .select({
                id: operator.id,
                nama: operator.nama,
                balai: operator.isBalai,
                lisensi: operator.lisensi,
                token: operator.token,
                whatsapp: operator.whatsapp,
                aset: {
                    id: aset.id,
                    nup: aset.nup,
                    deskripsi: aset.deskripsi
                }
            })
            .from(operator)
            .leftJoin(asetRuntime, eq(operator.id, asetRuntime.currentOperatorId))
            .leftJoin(aset, eq(asetRuntime.asetId, aset.id))
            .orderBy(operator.nama)
            .all();
        console.log('OPERATORS: ', allOperator.length);
        return { operators: allOperator }; 
    } 
    catch (e) { 
        console.log('ERROR: ', e);
        return { 
            operators: [], 
            error: "Gagal memuat data" }; 
        } 
    };