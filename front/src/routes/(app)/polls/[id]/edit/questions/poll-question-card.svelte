<script lang="ts">
  import Quill from '$lib/components/quill.svelte';
  import type { zPollAnswerSchema, zPollQuestionSchema } from '$lib/models';
  import type { z } from 'zod';

  export let question: z.infer<typeof zPollQuestionSchema>;
  export let answers: z.infer<typeof zPollAnswerSchema>[];
</script>

<div class="card mx-auto my-5 bg-base-100">
  <div class="card-body">
    <h4 class="card-title">Question</h4>

    <Quill contents={question.question} readOnly showControls={false} />

    {#each question.options.entries as opt (opt.key)}
      <!-- {@const ans = answers.filter((it) => it.answer === opt.key)} -->

      <!-- TODO: change so that red and green mean if the answer was wrong or correct -->
      <div class="form-control">
        <label class="label cursor-pointer justify-start gap-5">
          <input type="radio" name={question.id} class="radio" />
          <span class="label-text flex w-full justify-between">
            <span>
              {opt.key} (<code>{opt.value}</code>)
            </span>
          </span>
        </label>
      </div>
    {/each}

    <div class="card-actions justify-end">
      <a href={question.id} class="btn btn-primary btn-sm">editar</a>
      <button class="btn btn-warning btn-sm">Remover</button>
    </div>
  </div>
</div>
