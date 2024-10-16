import { zPollQuestionSchema, zPollSchema } from '$lib/models';
import { pb } from '$lib/pocketbase';
import { currentUser } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zEditPollQuestionSchema } from '$lib/schemas';

export let load: PageLoad = async ({ params, fetch }) => {
  const { id, qid } = params;

  const user = get(currentUser);
  if (!user || user.role !== 'editor') throw redirect(303, '/');

  try {
    const questionP = pb
      .collection('pollQuestions')
      .getOne(qid, { fetch })
      .then((q) => zPollQuestionSchema.parse(q));

    const pollP = pb
      .collection('polls')
      .getOne(id, { fetch })
      .then((l) => zPollSchema.parse(l));

    const [poll, question] = await Promise.all([pollP, questionP]);

    const form = await superValidate(question, zod(zEditPollQuestionSchema));

    return { poll, question, form };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
