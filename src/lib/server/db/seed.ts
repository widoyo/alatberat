import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { aset } from './schema';
import * as schema from './schema';

// Ambil dari variabel lingkungan standar
const dbUrl = process.env.DATABASE_URL; 

if (!dbUrl) throw new Error("DATABASE_URL tidak ditemukan");

const client = new Database(dbUrl);
const db = drizzle(client, { schema });

const dataAlatBerat = [
    { nama: "Excavator Mini", merk: "Excava 55", kodeBmn: "3010103001", nup: 1, tahun: 2024, noRangka: "PIN.EX5524.077", noMesin: "E55071", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Mini", merk: "Excava 55", kodeBmn: "3010103001", nup: 12, tahun: 2024, noRangka: "P155ITG03890", noMesin: "174A", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Long Arm", merk: "Excava 200 LA", kodeBmn: "3010103001", nup: 9, tahun: 2024, noRangka: "PINB 20.24.0421", noMesin: "12895992", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Long Arm", merk: "Excava 200 LA", kodeBmn: "3010103001", nup: 10, tahun: 2024, noRangka: "PINB.20.24.0322", noMesin: "12895989", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Standar", merk: "Excava 200", kodeBmn: "3010103001", nup: 6, tahun: 2024, noRangka: "PIN.EXCA 20.23.B0550", noMesin: "B0500", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Standar", merk: "Excava 200", kodeBmn: "3010103001", nup: 17, tahun: 2024, noRangka: "PIN.EXCA 20.23.B0551", noMesin: "B0501", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Standar", merk: "Excava 200", kodeBmn: "3010103001", nup: 18, tahun: 2024, noRangka: "PIN.EXCA 20.23.B0552", noMesin: "B0502", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Long Arm", merk: "Excava 200 LA", kodeBmn: "3010103001", nup: 3, tahun: 2024, noRangka: "PIN.EXCA 20.LA.21.B0018", noMesin: "B0421", lokasi: "Work Shop Bendung Perjaya" },
    { nama: "Excavator Standar", merk: "Excava 200", kodeBmn: "3010103001", nup: 13, tahun: 2024, noRangka: "PIN EXCA 20 24 0473", noMesin: "B 0553", lokasi: "Work Shop Bendung Perjaya" },
    { nama: "Excavator Mini", merk: "Excava 55", kodeBmn: "3010103001", nup: 1, tahun: 2024, noRangka: "PINEX 55 24 079", noMesin: "E550079", lokasi: "Work Shop Bendung Perjaya" },
    { nama: "Excavator Mini", merk: "Excava 55", kodeBmn: "3010103001", nup: 2, tahun: 2024, noRangka: "P1550F011", noMesin: "E550082", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Mini", merk: "Excava 55", kodeBmn: "3010103001", nup: 3, tahun: 2024, noRangka: "P1550F010", noMesin: "A6609A", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Mini", merk: "Excava 55", kodeBmn: "3010103001", nup: 4, tahun: 2024, noRangka: "P1550F009", noMesin: "A6684A", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Standar", merk: "Excava 200", kodeBmn: "3010103001", nup: 12, tahun: 2024, noRangka: "PINB 20 24 0043", noMesin: "B0554", lokasi: "Work Shop KM 7" },
    { nama: "Excavator Standar", merk: "Excava 200", kodeBmn: "3010103001", nup: 1, tahun: 2017, noRangka: "16J10 0047", noMesin: "11882253", lokasi: "Work Shop Pebem" },
    { nama: "Excavator Standar", merk: "Excava 200", kodeBmn: "3010103001", nup: 2, tahun: 2020, noRangka: "PINB 20 20 05 02", noMesin: "11895852", lokasi: "Work Shop Pebem" },
    { nama: "Excavator Long Arm", merk: "Excava LA 200", kodeBmn: "3010103001", nup: 4, tahun: 2023, noRangka: "PINB 20-23.0037", noMesin: "12490025", lokasi: "Work Shop Pebem" },
    { nama: "Ampibi Mini Standar", merk: "Sumitomo", kodeBmn: "3010203999", nup: 2, tahun: 2020, noRangka: "SMT075Y3T00BB2041", noMesin: "4LE-837286", lokasi: "Work Shop Pebem" },
    { nama: "Ampibi Mini Standar", merk: "Hyundai", kodeBmn: "3010203999", nup: 3, tahun: 2022, noRangka: "HJSCE167CN00007", noMesin: "4TNV98- ZCVHYB", lokasi: "Work Shop Pebem" },
    { nama: "Ampibi Mini Long Arm", merk: "Komatsu", kodeBmn: "3010103001", nup: 10, tahun: 2023, noRangka: "KMS 2209009", noMesin: "SAA4D95LE-5", lokasi: "Work Shop Pebem" },
    { nama: "Dump Truck", merk: "HINO 115 STD", kodeBmn: "3010105003", nup: 8, tahun: 2022, noRangka: "MJEACA4F5N5000994", noMesin: "NO4CWVJ1 1870", lokasi: "Rumah Pompa Bendung" },
    { nama: "Dump Truck", merk: "HINO 115 STD", kodeBmn: "3010105003", nup: 37, tahun: 2022, noRangka: "MJEACA4F5N5000994", noMesin: "NO4CWVJ1 185", lokasi: "Rumah Pompa Bendung" },
    { nama: "Dump Truck", merk: "Isuzu", kodeBmn: "3020103002", nup: 8, tahun: 2024, noRangka: "MHCNMR81HRJ120530", noMesin: "G120530", lokasi: "Rumah Pompa Bendung" },
    { nama: "Tronton/ Selfloader", merk: "HINO", kodeBmn: "3020103001", nup: 1, tahun: 2024, noRangka: "J08EEWDJ3 7430", noMesin: "J08EEWDJ3 7430", lokasi: "Work Shop KM 7" },
    { nama: "Mobil Pompa", merk: "HINO", kodeBmn: "3010305999", nup: 1, tahun: 2021, noRangka: "W0441/ TFJ88219", noMesin: "W0441/ TFJ88219", lokasi: "Rumah Pompa Bendung" },
    { nama: "Pompa Potable", merk: "KSB 1000", kodeBmn: "3010305010", nup: 13, tahun: 2017, noRangka: "PT83257*R0", noMesin: "10891B*", lokasi: "Rumah Pompa Bendung" },
    { nama: "Pompa Potable", merk: "KSB 1000", kodeBmn: "3010305010", nup: 14, tahun: 2017, noRangka: "PT83257*R0", noMesin: "10902B*", lokasi: "Rumah Pompa Bendung" }
];

export async function seedAset() {
    console.log("🌱 Memulai seeding data alat berat...");
    
    for (const item of dataAlatBerat) {
        await db.insert(aset).values({
            nama: item.nama,
            merk: item.merk,
            nup: item.nup.toString(), // Kita simpan sebagai string sesuai schema BMN
            tahun: item.tahun,
            noRangka: item.noRangka,
            noMesin: item.noMesin,
            lokasi: item.lokasi,
            kategoriAset: "Alat Berat", // Kategori tetap "Alat Berat" untuk semua item
            // Membuat No Lambung otomatis sederhana
            noLambung: `${item.merk.split(' ')[0]}-${item.nup}`.toUpperCase(),
            status: 'standby'
        });
    }

    console.log("✅ Seeding selesai!");
}

seedAset().catch((error) => {
    console.error("❌ Gagal melakukan seeding:", error);
});