<script lang="ts">
  import Quill from '$lib/components/quill.svelte';
  import type { zPollAnswerSchema, zPollQuestionSchema, zPollSchema } from '$lib/models';
  import { currentUser } from '$lib/stores/user';
  import type { z } from 'zod';

  export let poll: z.infer<typeof zPollSchema>;
  export let question: z.infer<typeof zPollQuestionSchema>;
  export let answers: z.infer<typeof zPollAnswerSchema>[];

  $: console.log(question, answers);
</script>

<div class="rounded border p-5">
  <Quill contents={question.question} readOnly showControls={false} />

  {#if question.options.kind === 'single'}
    <div class="mt-5 max-w-xs">
      {#each question.options.entries as opt (opt.key)}
        {@const ans = answers.filter((it) => it.answer === opt.value)}

        <!-- TODO: change so that red and green mean if the answer was wrong or correct -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-5">
            <input
              type="radio"
              name={question.id}
              class="radio checked:bg-red-500"
              checked={ans.length > 0}
              disabled
            />
            <span class="label-text flex w-full justify-between">
              <span>
                {opt.key}
              </span>

              {#if $currentUser?.id === poll.owner || $currentUser?.role === 'editor'}
                <span>
                  ({ans.length}) respostas ({((ans.length / answers.length) * 100).toFixed(2)}%)
                </span>
              {/if}
            </span>
          </label>
        </div>
      {/each}
    </div>
  {/if}

  <!-- <ul> -->
  <!--   {#each question.options.entries as opt (opt.key)} -->
  <!--     {@const ans = answers.filter((it) => it.answer === opt.key)} -->
  <!---->
  <!--     <li>{opt.key}: {ans.length} resposta{ans.length !== 1 ? 's' : ''}</li> -->
  <!--   {/each} -->
  <!-- </ul> -->
</div>
