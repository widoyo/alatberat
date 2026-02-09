const contohOperator = [
    {
        id: 1,
        nama: "Bambang Sugiantoro",
        lisensi: "SIO Kelas I (Excavator)",
        pengalamanTahun: 12,
        createdBy: 1
    },
    {
        id: 2,
        nama: "Eko Prasetyo",
        lisensi: "SIO Kelas II (Bulldozer)",
        pengalamanTahun: 8,
        createdBy: 1
    },
    {
        id: 3,
        nama: "Siti Aminah",
        lisensi: "SIM BII Umum (Dump Truck)",
        pengalamanTahun: 5,
        createdBy: 1
    },
    {
        id: 4,
        nama: "Agus Setiawan",
        lisensi: "SIO Tower Crane",
        pengalamanTahun: 15,
        createdBy: 1
    },
    {
        id: 5,
        nama: "Dewi Lestari",
        lisensi: "SIM BI (Forklift)",
        pengalamanTahun: 3,
        createdBy: 1
    }
];

import { db } from '$lib/server/db';
import { operator } from '$lib/server/db/schema';

// Jalankan ini di dalam script seed atau server action


export const GET = async (request) => {
    try {
        // Hapus data lama jika perlu (opsional)
        // await db.delete(aset); 
        
        await db.insert(operator).values(contohOperator);
        return new Response('Seed Berhasil');
    } catch (e) {
        console.log(e);
        return new Response('Gagal: ' + e?.message);
    }
};