import { currentUser } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { pb } from '$lib/pocketbase';
import { zUserSchema } from '$lib/models';

const zUserArraySchema = zUserSchema.array();

export let load: PageLoad = async () => {
  const user = get(currentUser);
  if (!user || user.role !== 'editor') throw redirect(303, '/');

  try {
    // FIXME: Don't get the full list, use pagination
    const users = await pb
      .collection('users')
      .getFullList({ fetch, filter: pb.filter('id!={:self}', { self: user.id }) })
      .then((l) => zUserArraySchema.parse(l));

    return { users };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
