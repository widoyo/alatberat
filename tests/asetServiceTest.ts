import 'dotenv/config'; // Harus di baris paling atas
import { asetService } from '../src/lib/server/db/services/aset.ts';

import { it, expect } from 'vitest';

it('Pengetesan Manual: getAll', async () => {
    const result = await asetService.getAll();

    // Tampilkan output ke terminal agar Anda bisa melihat datanya
    console.log('\n--- HASIL QUERY ASET ---');
    console.dir(result, { depth: null });
    console.log('------------------------\n');

    // Pengetesan minimal agar Vitest senang
    expect(result).toBeDefined();
});

it('Pengetesan Manual: getDetail', async () => {
    const detailId = 1;
    const result = await asetService.getDetail(detailId);

    // Tampilkan output ke terminal agar Anda bisa melihat datanya
    console.log('\n--- HASIL QUERY ASET ---');
    console.dir(result, { depth: null });
    console.log('------------------------\n');

    // Pengetesan minimal agar Vitest senang
    expect(result).toBeDefined();
});

it('Pengetesan Manual: getStats', async () => {
    const result = await asetService.getStats();

    // Tampilkan output ke terminal agar Anda bisa melihat datanya
    console.log('\n--- HASIL QUERY STATISTICS ---');
    console.dir(result, { depth: null });
    console.log('------------------------\n');

    // Pengetesan minimal agar Vitest senang
    expect(result).toBeDefined();
});

it('Pengetesan Manual: getAlatBeratOnDuty', async () => {
    const result = await asetService.getAlatBeratOnDuty();

    // Tampilkan output ke terminal agar Anda bisa melihat datanya
    console.log('\n--- HASIL QUERY ASET ON DUTY ---');
    console.dir(result, { depth: null });
    console.log('------------------------\n');

    // Pengetesan minimal agar Vitest senang
    expect(result).toBeDefined();
});

it('Pengetesan Manual: getAlatBeratOnIdle', async () => {
    const result = await asetService.getAlatBeratOnIdle();

    // Tampilkan output ke terminal agar Anda bisa melihat datanya
    console.log('\n--- HASIL QUERY ASET ON IDLE ---');
    console.dir(result, { depth: null });
    console.log('------------------------\n');

    // Pengetesan minimal agar Vitest senang
    expect(result).toBeDefined();
});
