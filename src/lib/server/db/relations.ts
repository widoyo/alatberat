// src/lib/server/db/relations.ts
import { relations } from 'drizzle-orm';
import * as table from './schema';

export const operatorRelations = relations(table.operator, ({ many }) => ({
    listAlatberat: many(table.aset),
}));

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

