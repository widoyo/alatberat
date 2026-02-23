import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
  name: z.string().default('Hello world!'),
  email: z.email()
});