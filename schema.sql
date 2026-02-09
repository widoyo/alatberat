-- skema handwriting hasil tulis tangan sambil ngalamun

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- admin, operator, manajer
    hp VARCHAR(35),
    unit_org_id INT
);

CREATE TABLE unit_org (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) UNIQUE NOT NULL,
    lokasi_unit VARCHAR(100),
    induk INT REFERENCES unit_org(id)
);

CREATE TABLE aset (
    /* Data Aset */
    id SERIAL PRIMARY KEY,
    nup VARCHAR(50) UNIQUE NOT NULL, -- Nomor BMN
    kategori_aset VARCHAR(100) NOT NULL, -- alat berat, kendaraan
    deskripsi TEXT,
    nilai_perolehan DECIMAL(15, 2) DEFAULT 0, -- untuk keperluan penyusutan
    tanggal_perolehan DATE, -- untuk penyusutan
    merk VARCHAR(100), 
    tipe VARCHAR(50), -- atau model
    kapasitas INT, -- kapasitas mesin
    tahun_pembuatan INT,
    lokasi_saat_ini VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_aset_deleted ON aset(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_aset_kategori ON aset(kategori_aset);

CREATE TABLE proyek (
    -- Data Proyek (kayaknya optional dulu?)
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    lokasi VARCHAR(100) NOT NULL,
    tanggal_mulai DATE,
    tanggal_selesai DATE
);

CREATE TABLE penggunaan_alat (
    /* Catatan Perpindahan, Siapa penanggung jawab, inspeksi */
    id SERIAL PRIMARY KEY,
    alatberat_id INT REFERENCES alatberat(id) NOT NULL,
    proyek_id INT REFERENCES proyek(id),
    penggunaan_terakhir INT REFERENCES penggunaan_alat(id),
    penanggung_jawab VARCHAR(100) NOT NULL, -- PPK atau penanggung jawab
    penggunaan_intern BOOLEAN DEFAULT TRUE, 
    -- inspeksi_awal TEXT, lihat di inspeksi keamanan
    tanggal_mulai DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    durasi_jam INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_penggunaan_alat_deleted ON penggunaan_alat(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_penanggung_jawab ON penggunaan_alat(penanggung_jawab);

CREATE TABLE inspeksi_keamanan (
    /* Catatan inspeksi keamanan alat berat, dilakukan saat penerimaan dan berkala */
    id SERIAL PRIMARY KEY,
    alatberat_id INT REFERENCES alatberat(id),
    penggunaan_alat_id INT REFERENCES penggunaan_alat(id),
    tanggal_inspeksi DATE NOT NULL,
    inspeksi_oleh VARCHAR(100) NOT NULL,
    status_penggerak_ok BOOLEAN DEFAULT TRUE, -- hasil inspeksi apakah siap pakai atau tidak
    catatan_penggerak TEXT, -- jika ada indikasi masalah penggerak
    status_hidrolik_ok BOOLEAN DEFAULT TRUE,
    catatan_hidrolik TEXT, -- jika ada indikasi masalah hidrolik
    status_kelistrikan_ok BOOLEAN DEFAULT TRUE,
    catatan_kelistrikan TEXT, -- jika ada indikasi masalah kelistrikan
    catatan_hasil_inspeksi TEXT NOT NULL,
    tindakan_perbaikan TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);

CREATE TABLE aktifitas_alat (
    /* Catatan harian penggunaan alat berat, oleh Operator Alat */
    id SERIAL PRIMARY KEY,
    aset_id INT REFERENCES aset(id),
    waktu_mulai TIMESTAMP NOT NULL,
    waktu_selesai TIMESTAMP,
    operator_nama VARCHAR(100) NOT NULL,
    deskripsi_aktifitas TEXT,
    indikasi_masalah BOOLEAN DEFAULT FALSE,
    catatan_masalah TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_aktifitas_alat_deleted ON aktifitas_alat(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_aset_id ON aktifitas_alat(aset_id);

CREATE TABLE bahan_bakar (
    /* Catatan penggunaan bahan bakar */
    id SERIAL PRIMARY KEY,
    aset_id INT REFERENCES aset(id),
    tanggal_pengisian DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    jumlah_liter DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    biaya DECIMAL(15, 2),
    lokasi_pengisian VARCHAR(100),
    catatan TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_bahan_bakar_deleted ON bahan_bakar(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_aset_id_bahan_bakar ON bahan_bakar(aset_id);

CREATE TABLE biaya_operasional (
    id SERIAL PRIMARY KEY,
    aset_id INT REFERENCES aset(id),
    tanggal DATE NOT NULL,
    jenis_biaya VARCHAR(100) NOT NULL,
    jumlah DECIMAL(15, 2) NOT NULL,
    catatan TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_biaya_operasional_deleted ON biaya_operasional(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_aset_id_biaya_operasional ON biaya_operasional(aset_id);
CREATE INDEX idx_jenis_biaya ON biaya_operasional(jenis_biaya);
CREATE INDEX idx_tanggal_biaya ON biaya_operasional(tanggal);

CREATE TABLE pemeliharaan_alat (
    /* Catatan pemeliharaan alat berat */
    id SERIAL PRIMARY KEY,
    aset_id INT REFERENCES aset(id),
    tanggal DATE NOT NULL,
    jenis_pemeliharaan VARCHAR(10) NOT NULL, -- rutin, darurat, besar
    deskripsi_pekerjaan TEXT, -- uraian pekerjaan yang dilakukan, ttg Hidroloik, kelistrikan, penggerak
    teknisi_nama VARCHAR(100), -- nama teknisi atau bengkel
    biaya DECIMAL(15, 2) DEFAULT 0,
    catatan TEXT, -- Catatan tambahan
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_pemeliharaan_alat_deleted ON pemeliharaan_alat(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_aset_id_pemeliharaan ON pemeliharaan_alat(aset_id);
CREATE INDEX idx_jenis_pemeliharaan ON pemeliharaan_alat(jenis_pemeliharaan);
CREATE INDEX idx_tanggal_pemeliharaan ON pemeliharaan_alat(tanggal);

CREATE TABLE operator (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) UNIQUE NOT NULL,
    lisensi VARCHAR(50),
    pengalaman_tahun INT DEFAULT 0 NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_operator_deleted ON operator(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_operator_nama ON operator(nama);

CREATE TABLE penugasan_operator (
    id SERIAL PRIMARY KEY,
    operator_id INT REFERENCES operator(id),
    aset_id INT REFERENCES aset(id),
    tanggal_penugasan DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    durasi_jam INT DEFAULT 0 NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_penugasan_operator_deleted ON penugasan_operator(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_aset_id_penugasan ON penugasan_operator(aset_id);
CREATE INDEX idx_operator_id_penugasan ON penugasan_operator(operator_id);
CREATE INDEX idx_tanggal_penugasan ON penugasan_operator(tanggal_penugasan);

CREATE TABLE suku_cadang (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) UNIQUE NOT NULL,
    stok INT DEFAULT 0, -- jumlah stok tersedia
    harga DECIMAL(15, 2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_suku_cadang_deleted ON suku_cadang(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_suku_cadang_nama ON suku_cadang(nama);
CREATE INDEX idx_suku_cadang_stok ON suku_cadang(stok) WHERE stok > 0;

CREATE TABLE penggunaan_suku_cadang (
    id SERIAL PRIMARY KEY,
    suku_cadang_id INT REFERENCES suku_cadang(id),
    aset_id INT REFERENCES aset(id),
    tanggal_penggunaan DATE NOT NULL,
    jumlah INT NOT NULL,
    harga_satuan DECIMAL(15, 2), -- salin dari suku_cadang.harga
    total_biaya DECIMAL(15, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_penggunaan_suku_cadang_deleted ON penggunaan_suku_cadang(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_aset_id_penggunaan_suku_cadang ON penggunaan_suku_cadang(aset_id);
CREATE INDEX idx_suku_cadang_id_penggunaan ON penggunaan_suku_cadang(suku_cadang_id);
CREATE INDEX idx_tanggal_penggunaan_suku_cadang ON penggunaan_suku_cadang(tanggal_penggunaan);

CREATE TABLE jadwal_pemeliharaan (
    -- Catatan Rencana Perawatan Rutin
    id SERIAL PRIMARY KEY,
    alatberat_id INT REFERENCES alatberat(id),
    tanggal_jadwal DATE NOT NULL,
    jenis_pemeliharaan VARCHAR(100) NOT NULL, -- Kategori: hidrolik,penggerak,listrik
    catatan TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_jadwal_pemeliharaan_deleted ON jadwal_pemeliharaan(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_alatberat_id_jadwal ON jadwal_pemeliharaan(alatberat_id);
CREATE INDEX idx_tanggal_jadwal ON jadwal_pemeliharaan(tanggal_jadwal);

CREATE TABLE vendor (
    -- Bengkel, Supplier sparepart
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kontak VARCHAR(100) NOT NULL,
    hp VARCHAR(35),
    alamat TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_vendor_deleted ON vendor(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_vendor_nama ON vendor(nama);

CREATE TABLE penerimaan_suku_cadang (
    /* Catatan penerimaan suku cadang dari vendor */
    id SERIAL PRIMARY KEY,
    vendor_id INT REFERENCES vendor(id),
    suku_cadang_id INT REFERENCES suku_cadang(id),
    tanggal_pembelian DATE NOT NULL,
    jumlah INT NOT NULL,
    total_biaya DECIMAL(15, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_penerimaan_suku_cadang_deleted ON penerimaan_suku_cadang(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_vendor_id_penerimaan ON penerimaan_suku_cadang(vendor_id);
CREATE INDEX idx_suku_cadang_id_penerimaan ON penerimaan_suku_cadang(suku_cadang_id);

CREATE TABLE audit_aset (
    id SERIAL PRIMARY KEY,
    aset_id INT REFERENCES aset(id),
    tanggal_audit DATE NOT NULL,
    auditor_nama VARCHAR(100) NOT NULL,
    hasil_audit TEXT NOT NULL, -- catatan hasil audit
    rekomendasi TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_audit_aset_deleted ON audit_aset(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_aset_id_audit ON audit_aset(aset_id);
CREATE INDEX idx_tanggal_audit ON audit_aset(tanggal_audit);

CREATE TABLE pelatihan_operator (
    -- Catatan pelatihan untuk operator alat berat, kayaknya opsional dulu
    id SERIAL PRIMARY KEY,
    operator_id INT REFERENCES operator(id),
    tanggal_pelatihan DATE NOT NULL,
    topik VARCHAR(100) NOT NULL,
    penyelenggara VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);

CREATE TABLE dokumentasi_aset (
    /* Foto, manual, sertifikat */
    id SERIAL PRIMARY KEY,
    aset_id INT REFERENCES aset(id),
    tanggal_upload DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    file_path TEXT NOT NULL,
    catatan VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    deleted_at DATETIME
);
CREATE INDEX idx_dokumentasi_aset_deleted ON dokumentasi_aset(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_aset_id_dokumentasi ON dokumentasi_aset(aset_id);
CREATE INDEX idx_tanggal_upload ON dokumentasi_aset(tanggal_upload);


