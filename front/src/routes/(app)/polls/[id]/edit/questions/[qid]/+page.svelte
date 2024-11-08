<script lang="ts">
  import { goto } from '$app/navigation';
  import PageGrid from '$lib/components/page-grid.svelte';
  import PollQuestionForm from '$lib/components/poll-question-form.svelte';
  import { pb } from '$lib/pocketbase';
  import { zEditPollQuestionSchema } from '$lib/schemas';
  import * as notif from '$lib/stores/notif';
  import { type Infer } from 'sveltekit-superforms';

  export let data;

  const action = async (d: Infer<typeof zEditPollQuestionSchema>) => {
    await pb.collection('pollQuestions').update(d.id, d);
    notif.addMessage({
      kind: 'info',
      message: 'Pergunta atualizada',
      // details: `Entrou como ${res.record.fullName}`,
    });

    goto(`/polls/${data.poll.id}/edit/questions`);
  };
</script>

<PageGrid>
  <ul slot="breadcrumbs">
    <li><a class="hover:text-white" href="/">Home</a></li>
    <li><a class="hover:text-white" href="/polls">Pesquisas</a></li>
    <li><a class="hover:text-white" href="/polls/{data.poll.id}">{data.poll.name}</a></li>
    <li><a class="hover:text-white" href="/polls/{data.poll.id}/edit">Editar</a></li>
    <li><a class="hover:text-white" href="/polls/{data.poll.id}/edit/questions">Perguntas</a></li>
    <li><a class="hover:text-white" href="/polls/{data.poll.id}/edit/{data.question.id}">Editar</a></li>
  </ul>

  <svelte:fragment slot="actions">
    <a href="../" class="btn btn-error btn-xs">cancelar</a>
  </svelte:fragment>

  <div class="card mx-auto my-5 bg-base-100">
    <PollQuestionForm data={data.form} {action}>Editar Pergunta</PollQuestionForm>
  </div>
</PageGrid>
