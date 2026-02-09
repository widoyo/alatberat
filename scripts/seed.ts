import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { penggunaanAset } from '../src/lib/server/db/schema';

dotenv.config({ path: resolve(process.cwd(), '.env') });
const connectionString = process.env.DATABASE_URL; 

if (!connectionString) {
    throw new Error("DATABASE_URL tidak ditemukan di .env");
}

const db = drizzle(connectionString);

async function seed() {
    console.log('🌱 Memulai seeding penggunaan_aset (Struktur Baru)...');

    // Helper untuk membuat tanggal acak antara rentang tertentu
    const hitungTanggal = (bulanLalu: number) => {
        const d = new Date();
        d.setMonth(d.getMonth() - bulanLalu);
        return d;
    };

    const dataContoh = [
        {
            asetId: 1,
            proyekId: 1,
            penanggungJawab: 'Budi Santoso',
            penggunaanIntern: true,
            tanggalMulai: hitungTanggal(12), // 1 tahun lalu
            tanggalSelesai: hitungTanggal(1), // Selesai 1 bulan lalu
        },
        {
            asetId: 3,
            proyekId: 1,
            penanggungJawab: 'Agus Prayogo',
            penggunaanIntern: true,
            tanggalMulai: hitungTanggal(6), // 6 bulan lalu
            tanggalSelesai: hitungTanggal(2), // Selesai 2 bulan lalu
        },
        {
            asetId: 5,
            proyekId: 1,
            penanggungJawab: 'Siti Aminah',
            penggunaanIntern: true,
            tanggalMulai: hitungTanggal(3), // 3 bulan lalu
            tanggalSelesai: null,           // Masih aktif digunakan
        },
        {
            asetId: 7,
            proyekId: 1,
            penanggungJawab: 'Iwan Fals',
            penggunaanIntern: false,        // Eksternal
            tanggalMulai: hitungTanggal(1), // 1 bulan lalu
            tanggalSelesai: new Date(),     // Selesai hari ini
        },
        {
            asetId: 10,
            proyekId: 1,
            penanggungJawab: 'Dedi Kurniawan',
            penggunaanIntern: true,
            tanggalMulai: hitungTanggal(9), // 9 bulan lalu
            tanggalSelesai: hitungTanggal(3), // Selesai 3 bulan lalu
        }
    ];

    try {
        // Bersihkan data lama jika diperlukan sebelum isi baru
        // await db.delete(penggunaanAset); 
        
        await db.insert(penggunaanAset).values(dataContoh);
        console.log('✅ Berhasil memasukkan 5 data simulasi penggunaan aset.');
    } catch (error) {
        console.error('❌ Gagal seeding:', error);
    }
}

//seed();