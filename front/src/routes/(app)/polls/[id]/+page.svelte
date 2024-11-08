<script lang="ts">
  import PageGrid from '$lib/components/page-grid.svelte';
  import Quill from '$lib/components/quill.svelte';
  import { pb } from '$lib/pocketbase.js';
  import { currentUser } from '$lib/stores/user.js';
  import * as notif from '$lib/stores/notif';
  import { invalidate } from '$app/navigation';
  import { zUserSchema } from '$lib/models';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  export let data;

  let audienceUsernames: { id: string; fullName: string }[] = [];
  let showAnswers = false;
  let showParticipants = false;

  // Função para alternar a visibilidade da lista de participantes
  const toggleParticipants = () => {
    showParticipants = !showParticipants;
  };

  const toggleAnswers = () => {
    showAnswers = !showAnswers;
  };

  const submitAnswer = async (questionId: string, selectedOptionKey: string) => {
    try {
      const newAnswer = {
        poll: data.poll.id,
        user: get(currentUser)?.id,
        question: questionId,
        answer: selectedOptionKey,
      };

      await pb.collection('pollAnswers').create(newAnswer);
      notif.addMessage({ kind: 'info', message: 'Resposta registrada com sucesso.' });
      invalidate('app:poll');
    } catch (error: unknown) {
      if (error instanceof Error) {
        notif.addMessage({ kind: 'error', message: 'Erro ao registrar resposta.', details: error.message });
      } else {
        notif.addMessage({ kind: 'error', message: 'Erro desconhecido ao registrar resposta.' });
      }
    }
  };

  async function fetchUsers() {
    const zUserArraySchema = zUserSchema.array();
    const usersInBD = await pb
      .collection('users')
      .getFullList({ fetch, filter: pb.filter('id!={:self}', { self: currentUser }) })
      .then((l) => zUserArraySchema.parse(l));
    return usersInBD.map(user => ({ id: user.id, fullName: user.fullName }));
  }

  onMount(async () => {
    audienceUsernames = await fetchUsers();
  });

  const openOrClose = async (open: boolean) => {
    try {
      const res = await pb.collection('polls').update(data.poll.id, { open });
      console.log(res);
      invalidate('app:poll');
    } catch (e) {
      notif.addMessage({
        kind: 'error',
        message: 'Falha em encerrar pesquisa',
        details: `${e}`,
      });
    }
  };
</script>

<PageGrid>
  <ul slot="breadcrumbs">
    <li><a class="hover:text-white" href="/">Home</a></li>
    <li><a class="hover:text-white" href="/polls">Pesquisas</a></li>
    <li><a class="hover:text-white" href="/polls/{data.poll.id}">{data.poll.name}</a></li>
  </ul>

  <svelte:fragment slot="actions">
    {#if data.poll.owner === $currentUser?.id}
      <a href="edit" class="btn btn-primary btn-xs rounded-lg hover:text-white">editar</a>
      <button class="btn btn-warning btn-xs rounded-lg hover:text-white">remover</button>
      {#if data.poll.open}
        <button class="btn btn-warning btn-xs rounded-lg hover:text-white" on:click={() => openOrClose(false)}>encerrar</button>
      {:else}
        <button class="btn btn-warning btn-xs rounded-lg hover:text-white" on:click={() => openOrClose(true)}>iniciar</button>
      {/if}
    {/if}
  </svelte:fragment>

  <div class="card mx-auto my-5 bg-base-100">
    <div class="card-body bg-gray-50 p-4 rounded-lg shadow-lg">
      <h4 class="card-title text-2xl font-bold">{data.poll.name}</h4>

      <!-- Descrição da pesquisa -->
    <div class="mt-2 text-lg">
      <Quill contents={data.poll.description} readOnly showControls={false} />
    </div>

      <!-- Lista de participantes -->

      <div class="mt-4">
        <button
          on:click={toggleParticipants}
          class="btn btn-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 ease-in-out shadow-md w-full max-w-md"
        >
          {showParticipants ? 'Fechar Participantes' : 'Ver Participantes'}
        </button>
      </div>

      {#if showParticipants}
      <div class="mt-4">
        <div class="font-bold text-lg mt-2 text-black-600">
          Participantes:
        </div>
        <ul class="pl-2 mt-2 space-y-2">
          {#each data.poll.audience as audiencia}
            {#each audienceUsernames as user}
              {#if audiencia === user.id}
                <li class="inline-block text-gray-700 hover:bg-gray-200 p-2 rounded-md transition-all">
                  <span class="font-medium">{user.fullName}</span>
                </li>
              {/if}
            {/each}
          {/each}
        </ul>
      </div>
    {/if}

      <!-- Botão para alternar entre abas -->
       <div class="mt-4">
        <button
        on:click={toggleAnswers}
        class="btn btn-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 ease-in-out shadow-md w-full max-w-md"
        >
        {showAnswers ? 'Fechar' : 'Responder Pesquisa'}
      </button>
       </div>
      


    <!-- Perguntas e respostas -->
    {#if showAnswers}
      <div class="mt-4 space-y-4">
        {#each data.questions as question (question.id)}
          <div class="mb-4 p-4 bg-white rounded-lg shadow-md">
            <h5 class="text-xl font-semibold text-gray-800">{question.question.ops[0].insert}</h5>
            <div class="mt-2">
              {#each question.options.entries as option}
                <label class="flex items-center space-x-3 mb-2">
                  <input
                    type={question.options.kind === 'multiple' ? 'checkbox' : 'radio'}
                    name="answer"
                    value={option.value}
                    on:change={() => submitAnswer(question.id, option.value)}
                    class="h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <span class="text-lg text-gray-700">{option.key}</span>
                </label>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</PageGrid>
