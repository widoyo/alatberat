import type { Actions } from './$types';
import * as auth from '$lib/server/auth';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { verify } from '@node-rs/argon2';

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		
		if (typeof username !== 'string' || typeof password !== 'string') {
			return fail(400, { message: 'Incorrect username or password' });
		}
		
		const next = formData.get('next')?.toString() || '/';
		const results = await db.select().from(users).where(eq(users.username, username));

        const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'username tidak ditemukan' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, next);
	},
} satisfies Actions;