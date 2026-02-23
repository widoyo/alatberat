import { sqliteTable, numeric, integer, foreignKey, index, text, real } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"
import { boolean } from "zod";

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }),
	username: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	role: text().notNull(),
	hp: text(),
	unitOrgId: integer("unit_org_id"),
});

export const session = sqliteTable("session", {
	id: text().primaryKey(),
	userId: integer("user_id").references(() => users.id),
	expiresAt: integer("expires_at", {mode: 'timestamp'}).notNull(),
});

export const unitOrg = sqliteTable("unit_org", {
	id: integer().primaryKey({ autoIncrement: true }),
	nama: text().notNull(),
	lokasiUnit: text("lokasi_unit"),
	induk: integer(),
},
(table) => [
	foreignKey(() => ({
			columns: [table.induk],
			foreignColumns: [table.id],
			name: "unit_org_induk_unit_org_id_fk"
		})),
]);

export const aset = sqliteTable("aset", {
	id: integer().primaryKey({ autoIncrement: true }),
	nup: text().notNull(),
	kategoriAset: text("kategori_aset").notNull(),
	deskripsi: text(),
	nilaiPerolehan: integer("nilai_perolehan"),
	tanggalPerolehan: integer("tanggal_perolehan"),
	merk: text(),
	tipe: text(),
	kapasitas: integer(),
	tahunPembuatan: integer("tahun_pembuatan"),
	lokasiSaatIni: text("lokasi_saat_ini"),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_aset_kategori").on(table.kategoriAset),
	index("idx_aset_deleted").on(table.deletedAt),
]);

// RUNTIME: State dinamis (Internal Developer Only)
// Untuk menyimpan data terkini operasional alat, diupdate dari berbagai situasi
export const asetRuntime = sqliteTable("aset_runtime", {
    asetId: integer("aset_id").primaryKey().references(() => aset.id, { onDelete: 'cascade' }),

	// Diupdate ketika membuat PenggunaanAset, atau perubahan ditengah perjalanan, misalnya Operator asli ijin dalam waktu lama
    currentOperatorId: integer("current_operator_id").references(() => operator.id).unique(),
	// Diupdate manual, atau berbasis entry aktifitasAset oleh Operator
    lastHm: real("last_hm").default(0).notNull(),
	// diupdate dari inspeksi atau diset paksa oleh admin
    statusKondisi: text("status_kondisi").default("baik"),
	// diisi otomatis saat data baru inspeksi diisi 
	isInspected: integer("is_inspected").references(() => inspeksiKeamanan.id),
	// update terakhir data ini
    lastUpdate: integer("last_update").default(sql`(CURRENT_TIMESTAMP)`)
});

export const proyek = sqliteTable("proyek", {
	id: integer().primaryKey({ autoIncrement: true }),
	nama: text().notNull(),
	lokasi: text().notNull(),
	tanggalMulai: integer("tanggal_mulai"),
	estimasiSelesai: integer("estimasi_selesai", {mode: "timestamp"}),
	tanggalSelesai: integer("tanggal_selesai", {mode: "timestamp"}),
});

export const penggunaanAset = sqliteTable("penggunaan_aset", {
	/* Data Pemesanan dan aktualisasi Penggunaan alat*/
	id: integer().primaryKey({ autoIncrement: true }),
	asetId: integer("aset_id").notNull().references(() => aset.id),

	/* Nama unit/instanse pengguna */
	pengguna: text("pengguna").notNull(),

	/* Penanggung jawab, nama personil */
	pic: text("pic_pengguna").notNull(),

	/* Personil yang akan mengoperasikan alat */
	operatorId: integer("operator_id").notNull().references(() => operator.id),

	/* Proyek / Pekerjaan / Aktifitas */
	proyek: text("proyek"),

	/* Penggunaan Intern Balai / Luar Balai */
	intern: integer("penggunaan_intern", { mode: 'boolean' }).default(sql`(TRUE)`),

	/* Tanggal rencana pakai */
	tanggalMulai: integer("tanggal_mulai", {mode: 'timestamp'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),

	/* Estimasi selesai / tanggal rencana selesai */
	estimasiSelesai: integer("estimasi_selesai", {mode: 'timestamp'}).default(sql`(NULL)`),

	/* Tanggal aktual selesai */
	tanggalSelesai: integer("tanggal_selesai", {mode: 'timestamp'}),

	/* latest_mh jam mesin terakhir */
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_pengguna").on(table.pengguna),
	index("idx_penggunaan_alat_deleted").on(table.deletedAt)
]);

export const inspeksiKeamanan = sqliteTable("inspeksi_keamanan", {
	id: integer().primaryKey({ autoIncrement: true }),
	asetId: integer("aset_id").references(() => aset.id),
	penggunaanAlatId: integer("penggunaan_alat_id").references(() => penggunaanAset.id),
	tanggalInspeksi: integer("tanggal_inspeksi").notNull(),
	inspeksiOleh: text("inspeksi_oleh").notNull(),
	statusPenggerakOk: integer("status_penggerak_ok").default(sql`(TRUE)`),
	catatanPenggerak: text("catatan_penggerak"),
	statusHidrolikOk: integer("status_hidrolik_ok").default(sql`(TRUE)`),
	catatanHidrolik: text("catatan_hidrolik"),
	statusKelistrikanOk: integer("status_kelistrikan_ok").default(sql`(TRUE)`),
	catatanKelistrikan: text("catatan_kelistrikan"),
	catatanHasilInspeksi: text("catatan_hasil_inspeksi").notNull(),
	tindakanPerbaikan: text("tindakan_perbaikan"),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
});

export const aktifitasAlat = sqliteTable("aktifitas_alat", {
	id: integer().primaryKey({ autoIncrement: true }),
	asetId: integer("aset_id").references(() => aset.id),
	waktuMulai: integer("waktu_mulai").notNull(),
	waktuSelesai: integer("waktu_selesai"),
	akhirHm: real("akhir_hm"), // HM = Hour Machine
	operatorId: integer("operator_id").references(() => operator.id).notNull(),
	deskripsiAktifitas: text("deskripsi_aktifitas"),
	indikasiMasalah: integer("indikasi_masalah").default(sql`(FALSE)`),
	catatanMasalah: text("catatan_masalah"),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_aset_id").on(table.asetId),
	index("idx_aktifitas_alat_deleted").on(table.deletedAt),
]);

export const bahanBakar = sqliteTable("bahan_bakar", {
	id: integer().primaryKey({ autoIncrement: true }),
	asetId: integer("aset_id").references(() => aset.id),
	tanggalPengisian: integer("tanggal_pengisian").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	jumlahLiter: numeric("jumlah_liter").notNull(),
	biaya: numeric(),
	lokasiPengisian: text("lokasi_pengisian"),
	catatan: text(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_aset_id_bahan_bakar").on(table.asetId),
	index("idx_bahan_bakar_deleted").on(table.deletedAt),
]);

export const biayaOperasional = sqliteTable("biaya_operasional", {
	id: integer().primaryKey({ autoIncrement: true }),
	asetId: integer("aset_id").references(() => aset.id),
	tanggal: integer("tanggal").notNull(),
	jenisBiaya: text("jenis_biaya").notNull(),
	jumlah: numeric().notNull(),
	catatan: text(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_tanggal_biaya").on(table.tanggal),
	index("idx_jenis_biaya").on(table.jenisBiaya),
	index("idx_aset_id_biaya_operasional").on(table.asetId),
	index("idx_biaya_operasional_deleted").on(table.deletedAt),
]);

export const pemeliharaanAlat = sqliteTable("pemeliharaan_alat", {
	id: integer().primaryKey({ autoIncrement: true }),
	asetId: integer("aset_id").references(() => aset.id),
	tanggal: integer("tanggal").notNull(),
	jenisPemeliharaan: text("jenis_pemeliharaan").notNull(),
	deskripsiPekerjaan: text("deskripsi_pekerjaan"),
	teknisiNama: text("teknisi_nama"),
	biaya: numeric(),
	catatan: text(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_tanggal_pemeliharaan").on(table.tanggal),
	index("idx_jenis_pemeliharaan").on(table.jenisPemeliharaan),
	index("idx_aset_id_pemeliharaan").on(table.asetId),
	index("idx_pemeliharaan_alat_deleted").on(table.deletedAt),
]);

export const operator = sqliteTable("operator", {
    id: integer("id").primaryKey({ autoIncrement: true }),
	// Nama Lengkap sesuai KTP
    nama: text("nama").notNull(),
	panggilan: text("nickname"),
    
    // Identitas Dasar
	isBalai: integer("is_balai").notNull().default(0), // pegawai balai
    lisensi: text("lisensi"), // Nomor SIO / SIM
    
    // Kontak & Status
    whatsapp: text("whatsapp"),
    status: text("status").default('aktif').notNull(), // 'aktif' / 'non-aktif'

	// token login, sarana login
	token: text("token").unique(),
	hashedSession: text("hashed_session"), 
	tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }),
    
    // Soft Delete (Tetap perlu agar data penggunaan lama tidak rusak jika operator dihapus)
    deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_operator_nama").on(table.nama),
	index("idx_operator_deleted").on(table.deletedAt),
]);

export const penugasanOperator = sqliteTable("penugasan_operator", {
	id: integer().primaryKey({ autoIncrement: true }),
	operatorId: integer("operator_id").references(() => operator.id),
	asetId: integer("aset_id").references(() => aset.id),
	tanggalPenugasan: integer("tanggal_penugasan").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	durasiJam: integer("durasi_jam").default(0).notNull(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_tanggal_penugasan").on(table.tanggalPenugasan),
	index("idx_operator_id_penugasan").on(table.operatorId),
	index("idx_aset_id_penugasan").on(table.asetId),
	index("idx_penugasan_operator_deleted").on(table.deletedAt),
]);

export const sukuCadang = sqliteTable("suku_cadang", {
	id: integer().primaryKey({ autoIncrement: true }),
	nama: text().notNull(),
	stok: integer().default(0),
	harga: numeric(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_suku_cadang_stok").on(table.stok),
	index("idx_suku_cadang_nama").on(table.nama),
	index("idx_suku_cadang_deleted").on(table.deletedAt),
]);

export const penggunaanSukuCadang = sqliteTable("penggunaan_suku_cadang", {
	id: integer().primaryKey({ autoIncrement: true }),
	sukuCadangId: integer("suku_cadang_id").references(() => sukuCadang.id),
	asetId: integer("aset_id").references(() => aset.id),
	tanggalPenggunaan: integer("tanggal_penggunaan").notNull(),
	jumlah: integer().notNull(),
	hargaSatuan: numeric("harga_satuan"),
	totalBiaya: numeric("total_biaya").notNull(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_tanggal_penggunaan_suku_cadang").on(table.tanggalPenggunaan),
	index("idx_suku_cadang_id_penggunaan").on(table.sukuCadangId),
	index("idx_aset_id_penggunaan_suku_cadang").on(table.asetId),
	index("idx_penggunaan_suku_cadang_deleted").on(table.deletedAt),
]);

export const jadwalPemeliharaan = sqliteTable("jadwal_pemeliharaan", {
	id: integer().primaryKey({ autoIncrement: true }),
	asetId: integer("aset_id").references(() => aset.id),
	tanggalJadwal: integer("tanggal_jadwal").notNull(),
	jenisPemeliharaan: text("jenis_pemeliharaan").notNull(),
	catatan: text(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_tanggal_jadwal").on(table.tanggalJadwal),
	index("idx_aset_id_jadwal").on(table.asetId),
	index("idx_jadwal_pemeliharaan_deleted").on(table.deletedAt),
]);

export const vendor = sqliteTable("vendor", {
	id: integer().primaryKey({ autoIncrement: true }),
	nama: text().notNull(),
	kontak: text().notNull(),
	hp: text(),
	alamat: text().notNull(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_vendor_nama").on(table.nama),
	index("idx_vendor_deleted").on(table.deletedAt),
]);

export const penerimaanSukuCadang = sqliteTable("penerimaan_suku_cadang", {
	id: integer().primaryKey({ autoIncrement: true }),
	vendorId: integer("vendor_id").references(() => vendor.id),
	sukuCadangId: integer("suku_cadang_id").references(() => sukuCadang.id),
	tanggalPembelian: integer("tanggal_pembelian").notNull(),
	jumlah: integer().notNull(),
	totalBiaya: numeric("total_biaya").notNull(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_suku_cadang_id_penerimaan").on(table.sukuCadangId),
	index("idx_vendor_id_penerimaan").on(table.vendorId),
	index("idx_penerimaan_suku_cadang_deleted").on(table.deletedAt),
]);

export const auditAset = sqliteTable("audit_aset", {
	id: integer().primaryKey({ autoIncrement: true }),
	asetId: integer("aset_id").references(() => aset.id),
	tanggalAudit: integer("tanggal_audit").notNull(),
	auditorNama: text("auditor_nama").notNull(),
	hasilAudit: text("hasil_audit").notNull(),
	rekomendasi: text(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_tanggal_audit").on(table.tanggalAudit),
	index("idx_aset_id_audit").on(table.asetId),
	index("idx_audit_aset_deleted").on(table.deletedAt),
]);

export const pelatihanOperator = sqliteTable("pelatihan_operator", {
	id: integer().primaryKey({ autoIncrement: true }),
	operatorId: integer("operator_id").references(() => operator.id),
	tanggalPelatihan: integer("tanggal_pelatihan").notNull(),
	topik: text().notNull(),
	penyelenggara: text().notNull(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
});

export const dokumentasiAset = sqliteTable("dokumentasi_aset", {
	id: integer().primaryKey({ autoIncrement: true }),
	asetId: integer("aset_id").references(() => aset.id),
	tanggalUpload: integer("tanggal_upload").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	filePath: text("file_path").notNull(),
	catatan: text(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: integer("created_by").references(() => users.id),
	deletedAt: integer("deleted_at"),
},
(table) => [
	index("idx_tanggal_upload").on(table.tanggalUpload),
	index("idx_aset_id_dokumentasi").on(table.asetId),
	index("idx_dokumentasi_aset_deleted").on(table.deletedAt),
]);

