import { zPollSchema } from '$lib/models';
import { pb } from '$lib/pocketbase';
import { zEditPollSchema } from '$lib/schemas';
import { currentUser } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageLoad } from './$types';

export let load: PageLoad = async ({ params, fetch }) => {
  const { id } = params;

  const user = get(currentUser);
  if (!user || user.role !== 'editor') throw redirect(303, '/');

  try {
    // FIXME: Don't get the full list, use pagination
    const poll = await pb
      .collection('polls')
      .getOne(id, { fetch })
      .then((l) => zPollSchema.parse(l));

    const form = await superValidate(poll, zod(zEditPollSchema))

    return { poll, form };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
;
