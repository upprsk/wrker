import { zPollSchema, zUserSchema } from '$lib/models';
import { pb } from '$lib/pocketbase';
import { zEditPollSchema } from '$lib/schemas';
import { currentUser } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageLoad } from './$types';

const zUserArraySchema = zUserSchema.array();

export let load: PageLoad = async ({ params, fetch }) => {
  const { id } = params;

  const user = get(currentUser);
  if (!user || user.role !== 'editor') throw redirect(303, '/');

  try {
    const pollP = pb
      .collection('polls')
      .getOne(id, { fetch })
      .then((l) => zPollSchema.parse(l));

    const usersP = pb
      .collection('users')
      .getFullList({ fetch, filter: pb.filter('id!={:self}', { self: user.id }) })
      .then((l) => zUserArraySchema.parse(l));

    const [poll, users] = await Promise.all([pollP, usersP]);
    const form = await superValidate(poll, zod(zEditPollSchema));

    return { poll, users, form };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
