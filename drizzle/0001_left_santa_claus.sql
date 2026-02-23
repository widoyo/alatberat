CREATE TABLE `aset_runtime` (
	`aset_id` integer PRIMARY KEY NOT NULL,
	`current_operator_id` integer,
	`last_hm` real DEFAULT 0 NOT NULL,
	`status_kondisi` text DEFAULT 'baik',
	`last_update` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`current_operator_id`) REFERENCES `operator`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `aset_runtime_current_operator_id_unique` ON `aset_runtime` (`current_operator_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_penggunaan_aset` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aset_id` integer NOT NULL,
	`proyek_id` integer,
	`penanggung_jawab` text(100) NOT NULL,
	`penggunaan_intern` integer DEFAULT (TRUE),
	`tanggal_mulai` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`tanggal_selesai` integer,
	`durasi_jam` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`deleted_at` integer,
	FOREIGN KEY (`aset_id`) REFERENCES `aset`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proyek_id`) REFERENCES `proyek`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_penggunaan_aset`("id", "aset_id", "proyek_id", "penanggung_jawab", "penggunaan_intern", "tanggal_mulai", "tanggal_selesai", "durasi_jam", "created_at", "created_by", "deleted_at") SELECT "id", "aset_id", "proyek_id", "penanggung_jawab", "penggunaan_intern", "tanggal_mulai", "tanggal_selesai", "durasi_jam", "created_at", "created_by", "deleted_at" FROM `penggunaan_aset`;--> statement-breakpoint
DROP TABLE `penggunaan_aset`;--> statement-breakpoint
ALTER TABLE `__new_penggunaan_aset` RENAME TO `penggunaan_aset`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_penanggung_jawab` ON `penggunaan_aset` (`penanggung_jawab`);--> statement-breakpoint
CREATE INDEX `idx_penggunaan_alat_deleted` ON `penggunaan_aset` (`deleted_at`);