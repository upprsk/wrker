import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { currentUser } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async () => {
  const user = get(currentUser);
  if (user) throw redirect(303, '/');
};
