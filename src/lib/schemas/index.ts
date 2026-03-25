import { z } from 'zod';

export const operatorSchema = z.object({
    nama: z.string().min(1, 'Nama operator harus diisi'),
    panggilan: z.string().optional(),
    whatsapp: z.string().min(7, 'Nomor WhatsApp harus diisi'),
});