// src/routes/api/aset/[nup]/status/+server.ts
import { json } from '@sveltejs/kit';
import { asetService } from '$lib/server/db/services/aset';
import { db } from '$lib/server/db';
import { aset } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
    const { nup } = params;

    // 1. Ambil data dengan left join
    const results = await db.select({
            id: aset.id,
            nup: aset.nup,
            deskripsi: aset.deskripsi,
        })
        .from(aset)
        .where(eq(aset.nup, nup))
        .limit(1);

    let data = results[0];

    // 2. Jika Aset tidak ada di Master sama sekali
    if (!data) {
        return json({ error: 'Aset tidak ditemukan di master' }, { status: 404 });
    }

    // 3. Logic Upsert: Jika data master ada tapi runtime belum ada

    // 4. Pastikan data adalah object sebelum masuk service
    // Ini adalah 'safety net' untuk mencegah TypeError
    if (!data) {
        return json({ error: 'Data processing error' }, { status: 500 });
    }

    const kelayakan = asetService.checkKelayakanPenggunaan(data);

    return json({
        nup: data.nup,
        isReady: kelayakan.isReady,
        reasons: kelayakan.reasons,
        lastUpdate: new Date().toISOString()
    });
};