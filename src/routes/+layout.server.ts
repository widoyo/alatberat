import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Data ini akan tersedia di $page.data.user di seluruh aplikasi
	return {
		user: locals.user
	};
};

