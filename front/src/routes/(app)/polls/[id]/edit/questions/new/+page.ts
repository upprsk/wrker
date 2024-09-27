import { zPollQuestionSchema, zPollSchema } from '$lib/models';
import { pb } from '$lib/pocketbase';
import { currentUser } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

const zPollQuestionArraySchema = zPollQuestionSchema.array()

export let load: PageLoad = async ({ params, fetch }) => {
  const { id } = params;

  const user = get(currentUser);
  if (!user || user.role !== 'editor') throw redirect(303, '/');

  try {
    const poll = await pb
      .collection('polls')
      .getOne(id, { fetch })
      .then((l) => zPollSchema.parse(l));

    return { poll };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
