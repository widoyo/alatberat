CREATE TABLE `aktifitas_alat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aset_id` integer,
	`waktu_mulai` integer NOT NULL,
	`waktu_selesai` integer,
	`operator_nama` text(100) NOT NULL,
	`deskripsi_aktifitas` text,
	`indikasi_masalah` integer DEFAULT (FALSE),
	`catatan_masalah` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_aset_id` ON `aktifitas_alat` (`aset_id`);--> statement-breakpoint
CREATE INDEX `idx_aktifitas_alat_deleted` ON `aktifitas_alat` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `aset` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nup` text(50) NOT NULL,
	`kategori_aset` text(100) NOT NULL,
	`deskripsi` text,
	`nilai_perolehan` integer,
	`tanggal_perolehan` integer,
	`merk` text(100),
	`tipe` text(50),
	`kapasitas` integer,
	`tahun_pembuatan` integer,
	`lokasi_saat_ini` text(20),
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_aset_kategori` ON `aset` (`kategori_aset`);--> statement-breakpoint
CREATE INDEX `idx_aset_deleted` ON `aset` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `audit_aset` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aset_id` integer,
	`tanggal_audit` integer NOT NULL,
	`auditor_nama` text(100) NOT NULL,
	`hasil_audit` text NOT NULL,
	`rekomendasi` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_tanggal_audit` ON `audit_aset` (`tanggal_audit`);--> statement-breakpoint
CREATE INDEX `idx_aset_id_audit` ON `audit_aset` (`aset_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_aset_deleted` ON `audit_aset` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `bahan_bakar` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aset_id` integer,
	`tanggal_pengisian` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`jumlah_liter` numeric NOT NULL,
	`biaya` numeric,
	`lokasi_pengisian` text(100),
	`catatan` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_aset_id_bahan_bakar` ON `bahan_bakar` (`aset_id`);--> statement-breakpoint
CREATE INDEX `idx_bahan_bakar_deleted` ON `bahan_bakar` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `biaya_operasional` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aset_id` integer,
	`tanggal` integer NOT NULL,
	`jenis_biaya` text(100) NOT NULL,
	`jumlah` numeric NOT NULL,
	`catatan` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_tanggal_biaya` ON `biaya_operasional` (`tanggal`);--> statement-breakpoint
CREATE INDEX `idx_jenis_biaya` ON `biaya_operasional` (`jenis_biaya`);--> statement-breakpoint
CREATE INDEX `idx_aset_id_biaya_operasional` ON `biaya_operasional` (`aset_id`);--> statement-breakpoint
CREATE INDEX `idx_biaya_operasional_deleted` ON `biaya_operasional` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `dokumentasi_aset` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aset_id` integer,
	`tanggal_upload` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`file_path` text NOT NULL,
	`catatan` text(100),
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_tanggal_upload` ON `dokumentasi_aset` (`tanggal_upload`);--> statement-breakpoint
CREATE INDEX `idx_aset_id_dokumentasi` ON `dokumentasi_aset` (`aset_id`);--> statement-breakpoint
CREATE INDEX `idx_dokumentasi_aset_deleted` ON `dokumentasi_aset` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `inspeksi_keamanan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aset_id` integer,
	`penggunaan_alat_id` integer,
	`tanggal_inspeksi` integer NOT NULL,
	`inspeksi_oleh` text(100) NOT NULL,
	`status_penggerak_ok` integer DEFAULT (TRUE),
	`catatan_penggerak` text,
	`status_hidrolik_ok` integer DEFAULT (TRUE),
	`catatan_hidrolik` text,
	`status_kelistrikan_ok` integer DEFAULT (TRUE),
	`catatan_kelistrikan` text,
	`catatan_hasil_inspeksi` text NOT NULL,
	`tindakan_perbaikan` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`penggunaan_alat_id`) REFERENCES `penggunaan_aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `jadwal_pemeliharaan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aset_id` integer,
	`tanggal_jadwal` integer NOT NULL,
	`jenis_pemeliharaan` text(100) NOT NULL,
	`catatan` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_tanggal_jadwal` ON `jadwal_pemeliharaan` (`tanggal_jadwal`);--> statement-breakpoint
CREATE INDEX `idx_aset_id_jadwal` ON `jadwal_pemeliharaan` (`aset_id`);--> statement-breakpoint
CREATE INDEX `idx_jadwal_pemeliharaan_deleted` ON `jadwal_pemeliharaan` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `operator` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text(100) NOT NULL,
	`lisensi` text(50),
	`pengalaman_tahun` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_operator_nama` ON `operator` (`nama`);--> statement-breakpoint
CREATE INDEX `idx_operator_deleted` ON `operator` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `pelatihan_operator` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`operator_id` integer,
	`tanggal_pelatihan` integer NOT NULL,
	`topik` text(100) NOT NULL,
	`penyelenggara` text(100) NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pemeliharaan_alat` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aset_id` integer,
	`tanggal` integer NOT NULL,
	`jenis_pemeliharaan` text(10) NOT NULL,
	`deskripsi_pekerjaan` text,
	`teknisi_nama` text(100),
	`biaya` numeric,
	`catatan` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_tanggal_pemeliharaan` ON `pemeliharaan_alat` (`tanggal`);--> statement-breakpoint
CREATE INDEX `idx_jenis_pemeliharaan` ON `pemeliharaan_alat` (`jenis_pemeliharaan`);--> statement-breakpoint
CREATE INDEX `idx_aset_id_pemeliharaan` ON `pemeliharaan_alat` (`aset_id`);--> statement-breakpoint
CREATE INDEX `idx_pemeliharaan_alat_deleted` ON `pemeliharaan_alat` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `penerimaan_suku_cadang` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vendor_id` integer,
	`suku_cadang_id` integer,
	`tanggal_pembelian` integer NOT NULL,
	`jumlah` integer NOT NULL,
	`total_biaya` numeric NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`suku_cadang_id`) REFERENCES `suku_cadang`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_suku_cadang_id_penerimaan` ON `penerimaan_suku_cadang` (`suku_cadang_id`);--> statement-breakpoint
CREATE INDEX `idx_vendor_id_penerimaan` ON `penerimaan_suku_cadang` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `idx_penerimaan_suku_cadang_deleted` ON `penerimaan_suku_cadang` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `penggunaan_aset` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aset_id` integer NOT NULL,
	`proyek_id` integer,
	`penggunaan_terakhir` integer,
	`penanggung_jawab` text(100) NOT NULL,
	`penggunaan_intern` integer DEFAULT (TRUE),
	`tanggal_mulai` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`durasi_jam` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proyek_id`) REFERENCES `proyek`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`penggunaan_terakhir`) REFERENCES `penggunaan_aset`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_penanggung_jawab` ON `penggunaan_aset` (`penanggung_jawab`);--> statement-breakpoint
CREATE INDEX `idx_penggunaan_alat_deleted` ON `penggunaan_aset` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `penggunaan_suku_cadang` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`suku_cadang_id` integer,
	`aset_id` integer,
	`tanggal_penggunaan` integer NOT NULL,
	`jumlah` integer NOT NULL,
	`harga_satuan` numeric,
	`total_biaya` numeric NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`suku_cadang_id`) REFERENCES `suku_cadang`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_tanggal_penggunaan_suku_cadang` ON `penggunaan_suku_cadang` (`tanggal_penggunaan`);--> statement-breakpoint
CREATE INDEX `idx_suku_cadang_id_penggunaan` ON `penggunaan_suku_cadang` (`suku_cadang_id`);--> statement-breakpoint
CREATE INDEX `idx_aset_id_penggunaan_suku_cadang` ON `penggunaan_suku_cadang` (`aset_id`);--> statement-breakpoint
CREATE INDEX `idx_penggunaan_suku_cadang_deleted` ON `penggunaan_suku_cadang` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `penugasan_operator` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`operator_id` integer,
	`aset_id` integer,
	`tanggal_penugasan` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`durasi_jam` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_tanggal_penugasan` ON `penugasan_operator` (`tanggal_penugasan`);--> statement-breakpoint
CREATE INDEX `idx_operator_id_penugasan` ON `penugasan_operator` (`operator_id`);--> statement-breakpoint
CREATE INDEX `idx_aset_id_penugasan` ON `penugasan_operator` (`aset_id`);--> statement-breakpoint
CREATE INDEX `idx_penugasan_operator_deleted` ON `penugasan_operator` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `proyek` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text(100) NOT NULL,
	`lokasi` text(100) NOT NULL,
	`tanggal_mulai` integer,
	`tanggal_selesai` integer
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `suku_cadang` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text(100) NOT NULL,
	`stok` integer DEFAULT 0,
	`harga` numeric,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_suku_cadang_stok` ON `suku_cadang` (`stok`);--> statement-breakpoint
CREATE INDEX `idx_suku_cadang_nama` ON `suku_cadang` (`nama`);--> statement-breakpoint
CREATE INDEX `idx_suku_cadang_deleted` ON `suku_cadang` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `unit_org` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text(100) NOT NULL,
	`lokasi_unit` text(100),
	`induk` integer,
	FOREIGN KEY (`induk`) REFERENCES `unit_org`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text(50) NOT NULL,
	`password_hash` text(255) NOT NULL,
	`role` text(50) NOT NULL,
	`hp` text(35),
	`unit_org_id` integer
);
--> statement-breakpoint
CREATE TABLE `vendor` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text(100) NOT NULL,
	`kontak` text(100) NOT NULL,
	`hp` text(35),
	`alamat` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_vendor_nama` ON `vendor` (`nama`);--> statement-breakpoint
CREATE INDEX `idx_vendor_deleted` ON `vendor` (`deleted_at`);