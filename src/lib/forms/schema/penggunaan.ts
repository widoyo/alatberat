import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
  pengguna: z.string().default('OP Balai'),
  pic: z.email(),
  tanggalMulai: z.date(),
  estimasiSelesai: z.date(),
});