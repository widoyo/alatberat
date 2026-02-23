// src/lib/server/db/relations.ts
import { relations } from 'drizzle-orm';
import * as table from './schema';

export const penggunaanAsetRelations = relations(table.penggunaanAset, ({ one }) => ({
    aset: one(table.aset, {
        fields: [table.penggunaanAset.asetId],
        references: [table.aset.id],
    })
}));

export const bahanbakarRelations = relations(table.bahanBakar, ({ one }) => ({
    aset: one(table.aset, {
        fields: [table.bahanBakar.asetId],
        references: [table.aset.id],
    }),
}));

export const asetUsageRelations = relations(table.aset, ({ many }) => ({
    penggunaan: many(table.penggunaanAset),
    bahanbakar: many(table.bahanBakar),
}));

export const operatorAktifitasRelations = relations(table.operator, ({ many }) => ({
    aktifitas: many(table.aktifitasAlat),
}));

export const aktifitasAlatRelations = relations(table.aktifitasAlat, ({ one }) => ({
    operator: one(table.operator, {
        fields: [table.aktifitasAlat.operatorId],
        references: [table.operator.id],
    }),
}));

// 1. Relasi untuk Tabel Aset
export const asetRelations = relations(table.aset, ({ one }) => ({
    runtime: one(table.asetRuntime, {
        fields: [table.aset.id],
        references: [table.asetRuntime.asetId],
    }),
}));

// 2. Relasi untuk Tabel AsetRuntime (Jembatan)
export const asetRuntimeRelations = relations(table.asetRuntime, ({ one }) => ({
    aset: one(table.aset, {
        fields: [table.asetRuntime.asetId],
        references: [table.aset.id],
    }),
    operator: one(table.operator, {
        fields: [table.asetRuntime.currentOperatorId],
        references: [table.operator.id],
    }),
}));

// 3. Relasi untuk Tabel Operator
export const operatorRelations = relations(table.operator, ({ one, many }) => ({
    // Relasi ke status alat yang sedang dibawa saat ini (1-to-1 via Runtime)
    currentAsetRuntime: one(table.asetRuntime, {
        fields: [table.operator.id],
        references: [table.asetRuntime.currentOperatorId],
    }),
    // Relasi ke sejarah aktifitas (1-to-many)
    aktifitas: many(table.aktifitasAlat),
}));