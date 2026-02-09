// src/lib/server/db/relations.ts
import { relations } from 'drizzle-orm';
import { penggunaanAset, aset, proyek, users, bahanBakar } from './schema';

export const penggunaanAsetRelations = relations(penggunaanAset, ({ one }) => ({
    aset: one(aset, {
        fields: [penggunaanAset.asetId],
        references: [aset.id],
    }),
    proyek: one(proyek, {
        fields: [penggunaanAset.proyekId],
        references: [proyek.id],
    }),
}));

export const bahanbakarRelations = relations(bahanBakar, ({ one }) => ({
    aset: one(aset, {
        fields: [bahanBakar.asetId],
        references: [aset.id],
    }),
}));

export const asetRelations = relations(aset, ({ many }) => ({
    penggunaan: many(penggunaanAset),
    bahanbakar: many(bahanBakar),
}));

export const proyekRelations = relations(proyek, ({ many }) => ({
    penggunaan: many(penggunaanAset),
}));