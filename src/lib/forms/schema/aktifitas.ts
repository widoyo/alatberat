import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
  tanggalPengisian: z.date(),
  volume: z.number(),
  penerima: z.string(),
});