<script lang="ts">
  import Quill from '$lib/components/quill.svelte';
  import type { zPollQuestionSchema } from '$lib/models';
  import type { z } from 'zod';

  export let question: z.infer<typeof zPollQuestionSchema>;
</script>

<div class="card mx-auto my-5 bg-base-100">
  <div class="card-body">
    <h4 class="card-title">Question</h4>

    <Quill contents={question.question} readOnly showControls={false} />

    <div class="divider"></div>

    <ul>
      {#each question.options.entries as opt (opt.key)}
        <li>{opt.key}</li>
      {/each}
    </ul>

    <div class="card-actions justify-end">
      <a href={question.id} class="btn btn-primary btn-sm">editar</a>
      <button class="btn btn-warning btn-sm">Remover</button>
    </div>
  </div>
</div>
