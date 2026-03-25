import { db } from '../index';
import { aset, penggunaanAset } from '../schema';
import { eq, isNull, isNotNull, notExists, and, sql } from 'drizzle-orm';

export const asetService = {
    // 1. Ambil semua aset yang belum dihapus (Soft Delete)
    getAll: async () => {
        return await db.query.aset.findMany({
            where: and(eq(aset.kategoriAset, 'alat berat'), isNull(aset.deletedAt)),
            orderBy: (table, { asc }) => [asc(table.nup)]
        });
    },

    // 2. Ambil detail satu aset lengkap dengan sejarah penggunaannya
    getDetail: async (id: number) => {
        return await db.query.aset.findFirst({
            where: and(eq(aset.id, id), isNull(aset.deletedAt)),
            with: {
                penggunaan: {
                    orderBy: (table, { desc }) => [desc(table.tanggalMulai)]
                },
                bahanbakar: {
                    orderBy: (table, { desc }) => [desc(table.tanggalPengisian)]
                }
            }
        });
    },

    // 3. Ringkasan status aset (Misal: Total Unit, Unit Rusak, dll)
    getStats: async () => {
        const counts = await db.select({
            total: sql<number>`count(${aset.id})`,
            perKategori: sql`JSON_GROUP_ARRAY(${aset.kategoriAset})`
        }).from(aset).where(isNull(aset.deletedAt));
        
        return counts[0];
    },

    // 4. Update lokasi atau status aset secara cepat
    updateLokasi: async (id: number, lokasiBaru: string) => {
        return await db.update(aset)
            .set({ lokasi: lokasiBaru })
            .where(eq(aset.id, id));
    },

    // 5. Soft Delete (Hanya menandai, tidak menghapus fisik)
    softDelete: async (id: number) => {
        return await db.update(aset)
            .set({ deletedAt: Math.floor(Date.now() / 1000) })
            .where(eq(aset.id, id));
    },
    /**
     * Menampilkan aset yang sedang digunakan (tanggalSelesai masih kosong)
     */
    getAlatBeratOnDuty: async () => {
        return await db.query.aset.findMany({
            where: and(
                isNull(aset.deletedAt), 
                eq(aset.kategoriAset, 'alat berat')
            ),
            with: {
                penggunaan: {
                    where: isNull(penggunaanAset.tanggalSelesai),
                }
            },
            // Filter hanya aset yang memiliki data penggunaan aktif
            // (Drizzle relational query mengembalikan array kosong jika tidak match)
        }).then(items => items.filter(i => i.penggunaan.length > 0));
    },

    /**
     * Menampilkan aset yang tidak memiliki penggunaan aktif
     */
    getAlatBeratOnIdle: async () => {
        // Logika: Ambil semua aset, lalu filter yang tidak punya penggunaan bernilai NULL pada tanggalSelesai
        const allAset = await db.query.aset.findMany({
            where: and(
                isNull(aset.deletedAt),
                eq(aset.kategoriAset, 'alat berat'),
                notExists(
                db.select()
                  .from(penggunaanAset)
                  .where(
                      and(
                          eq(penggunaanAset.asetId, aset.id),
                          isNull(penggunaanAset.tanggalSelesai)
                      )
                  )
            )
            ),
            with: {
                penggunaan: {
                    where: isNotNull(penggunaanAset.tanggalSelesai),
                    limit: 1,
                    orderBy: (table, { desc }) => [desc(table.tanggalMulai)]
                }
            }
        });
        
        // Aset dianggap IDLE jika daftar penggunaan aktifnya kosong
        return allAset;
    },
    getDetailByNup: async (nup: string) => {
        return await db.query.aset.findFirst({
            where: and(eq(aset.nup, nup), isNull(aset.deletedAt)),
            with: {
                penggunaan: {
                    orderBy: (table, { desc }) => [desc(table.tanggalMulai)]
                },
                bahanbakar: {
                    orderBy: (table, { desc }) => [desc(table.tanggalPengisian)]
                }
            }
        });
    },
/**
     * Mengecek apakah aset layak untuk dimunculkan tombol "Entry Penggunaan Baru"
     * Logic: Harus sudah diinspeksi (isInspected === true)
     */
    checkKelayakanPenggunaan: (data: any) => {
        const reasons = [];

        // 1. Cek status inspeksi
        // Kita gunakan perbandingan yang kuat (strict)
        if (data.isInspected !== true && data.isInspected !== 1) {
            reasons.push("Alat belum melewati tahap inspeksi pasca penggunaan terakhir.");
        }

        // Anda bisa tambah logic lain di sini nanti, misal:
        // if (data.status === 'BREAKDOWN') reasons.push("Alat dalam kondisi rusak.");

        return {
            isReady: reasons.length === 0,
            reasons: reasons
        };
    },

};