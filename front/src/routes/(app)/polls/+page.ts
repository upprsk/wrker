import { zPollAnswerSchema, zPollQuestionSchema, zPollSchema } from '$lib/models';
import { pb } from '$lib/pocketbase';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { currentUser } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import { z } from 'zod';

const zReducedAnswersArraySchema = zPollAnswerSchema
  .extend({
    expand: z.object({ question: zPollQuestionSchema }).optional(),
  })
  .array();
const zPollArraySchema = zPollSchema.array();
const zPollQuestionArraySchema = zPollQuestionSchema.pick({ id: true, poll: true }).array();

export let load: PageLoad = async ({ fetch }) => {
  const user = get(currentUser);
  if (!user) throw redirect(303, '/');

  try {
    // FIXME: Don't get the full list, use pagination
    const pollsP = pb
      .collection('polls')
      .getFullList({ fetch, sort: '-created' })
      .then((l) => zPollArraySchema.parse(l));

    const questionsP = pb
      .collection('pollQuestions')
      .getFullList({ fetch, fields: 'id,poll' })
      .then((l) => zPollQuestionArraySchema.parse(l));

    const answersP = pb
      .collection('pollAnswers')
      .getFullList({ fetch, expand: 'question' })
      .then((l) => zReducedAnswersArraySchema.parse(l));

    const [polls, questions, answers] = await Promise.all([pollsP, questionsP, answersP]);

    return {
      polls,
      questions,
      answers,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
