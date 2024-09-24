import { currentUser } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export let load: PageLoad = async () => {
  const user = get(currentUser);
  if (!user || user.role !== 'editor') throw redirect(303, '/');
};
