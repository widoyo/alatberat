import { db } from '$lib/server/db';
import { proyek } from '$lib/server/db/schema';
import { like } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
    const q = url.searchParams.get('q') ?? '';
    if (q.length < 3) return json([]);

    const results = await db.select().from(proyek)
        .where(like(proyek.nama, `%${q}%`))
        .limit(5);

    return json(results);
};