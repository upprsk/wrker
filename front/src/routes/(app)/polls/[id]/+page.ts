import { zPollSchema } from '$lib/models';
import { pb } from '$lib/pocketbase';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { currentUser } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';

export let load: PageLoad = async ({ params, fetch, depends }) => {
  const { id } = params;

  const user = get(currentUser);
  if (!user) throw redirect(303, '/');

  try {
    // FIXME: Don't get the full list, use pagination
    const poll = await pb
      .collection('polls')
      .getOne(id, { fetch })
      .then((l) => zPollSchema.parse(l));

    depends('app:poll');

    return { poll };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
