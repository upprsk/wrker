import { zPollQuestionSchema, zPollSchema } from '$lib/models';
import { pb } from '$lib/pocketbase';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { currentUser } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';

const zPollQuestionArraySchema = zPollQuestionSchema.array()

export let load: PageLoad = async ({ params, fetch, depends }) => {
  const { id } = params;

  const user = get(currentUser);
  if (!user) throw redirect(303, '/');

  try {
    const pollP = pb
      .collection('polls')
      .getOne(id, { fetch })
      .then((l) => zPollSchema.parse(l));

    const questionsP = pb
      .collection('pollQuestions')
      .getFullList({ fetch, filter: pb.filter('poll={:poll}', { poll: id }) })
      .then(l => zPollQuestionArraySchema.parse(l))

    depends('app:poll');

    const [poll, questions] = await Promise.all([pollP, questionsP])

    return { poll, questions };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
