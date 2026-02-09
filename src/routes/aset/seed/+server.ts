const alatBerat = Array.from({ length: 5 }, (_, i) => ({
    nup: `AB-2026-${(i + 1).toString().padStart(3, '0')}`,
    kategoriAset: 'alat berat',
    deskripsi: `Unit Excavator Tipe-${i + 1}`,
    nilaiPerolehan: (500000000 + (i * 15000000)).toString(),
    tanggalPerolehan: Date.now(),
    merk: i % 2 === 0 ? 'Caterpillar' : 'Komatsu',
    tipe: i % 2 === 0 ? '320D' : 'PC200',
    kapasitas: 20,
    tahunPembuatan: 2020 + (i % 5),
    lokasiSaatIni: 'Site-A',
    createdBy: 1
}));

const buldozer = Array.from({ length: 5 }, (_, i) => ({
    nup: `AB-2025-${(i + 1).toString().padStart(3, '0')}`,
    kategoriAset: 'alat berat',
    deskripsi: `Unit Bulldozer Tipe-${i + 1}`,
    nilaiPerolehan: (500000000 + (i * 15000000)).toString(),
    tanggalPerolehan: Date.now(),
    merk: i % 2 === 0 ? 'Caterpillar' : 'Komatsu',
    tipe: i % 2 === 0 ? '320D' : 'PC200',
    kapasitas: 20,
    tahunPembuatan: 2020 + (i % 5),
    lokasiSaatIni: 'Site-B',
    createdBy: 1
}));

const kendaraanOperasional = Array.from({ length: 10 }, (_, i) => ({
    nup: `KO-2026-${(i + 1).toString().padStart(3, '0')}`,
    kategoriAset: 'kendaraan operasional',
    deskripsi: `Mobil Dinas Operasional Unit ${i + 1}`,
    nilaiPerolehan: (250000000 + (i * 2000000)).toString(),
    tanggalPerolehan: Date.now(),
    merk: i % 3 === 0 ? 'Toyota' : (i % 3 === 1 ? 'Mitsubishi' : 'Honda'),
    tipe: i % 3 === 0 ? 'Avanza' : (i % 3 === 1 ? 'Triton' : 'CR-V'),
    kapasitas: 1500 + (i * 10),
    tahunPembuatan: 2021 + (i % 4),
    lokasiSaatIni: 'Pool-Utama',
    createdBy: 1
}));

const seedAsets = [...alatBerat, ...buldozer, ...kendaraanOperasional];

import { db } from '$lib/server/db';
import { aset } from '$lib/server/db/schema';

export const GET = async (request) => {
    try {
        // Hapus data lama jika perlu (opsional)
        // await db.delete(aset); 
        
        await db.insert(aset).values(seedAsets);
        return new Response('Seed Berhasil');
    } catch (e) {
        console.log(e);
        return new Response('Gagal: ' + e?.message);
    }
};