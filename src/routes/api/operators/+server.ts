import { db } from '$lib/server/db';
import { operator } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { like, and, isNull, eq } from 'drizzle-orm';

export const GET = async ({ url }) => {
    const searchTerm = url.searchParams.get('q');

    // Slow and Low: Jangan bebani DB jika input kurang dari 2 karakter
    if (!searchTerm || searchTerm.length < 2) {
        return json([]);
    }

    try {
        const results = await db
            .select({
                id: operator.id,
                nama: operator.nama,
                jenis: operator.jenis,
                lisensi: operator.lisensi,
                whatsapp: operator.whatsapp,
                status: operator.status
            })
            .from(operator)
            .where(
                and(
                    like(operator.nama, `%${searchTerm}%`),
                    isNull(operator.deletedAt), // Saring yang belum dihapus
                    eq(operator.status, 'aktif') // Hanya operator siap kerja
                )
            )
            .limit(10); // Limit cukup 10 untuk dropdown UI

        return json(results);
    } catch (err) {
        console.error("API Operators Error:", err);
        return json({ error: "Gagal mengambil data operator" }, { status: 500 });
    }
};