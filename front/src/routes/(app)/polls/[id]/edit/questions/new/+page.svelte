<script lang="ts">
  import { goto } from '$app/navigation';
  import PageGrid from '$lib/components/page-grid.svelte';
  import PollQuestionForm from '$lib/components/poll-question-form.svelte';
  import { pb } from '$lib/pocketbase';
  import { zEditPollQuestionSchema } from '$lib/schemas';
  import * as notif from '$lib/stores/notif';
  import { defaults, type Infer } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';

  export let data;

  const action = async (d: Infer<typeof zEditPollQuestionSchema>) => {
    await pb.collection('pollQuestions').create({ ...d, poll: data.poll.id });
    notif.addMessage({
      kind: 'info',
      message: 'Pergunta criada',
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
    <li><a class="hover:text-white" href="/polls/{data.poll.id}/edit/new">Nova</a></li>
  </ul>

  <svelte:fragment slot="actions">
    <a href="../" class="btn btn-error btn-xs rounded-lg hover:text-white">cancelar</a>
  </svelte:fragment>

  <div class="card mx-auto my-5 bg-base-100">
    <PollQuestionForm data={defaults(zod(zEditPollQuestionSchema))} {action}>
      Nova Pergunta
    </PollQuestionForm>
  </div>
</PageGrid>
