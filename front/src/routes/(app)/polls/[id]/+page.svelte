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
  let userAlreadyAnswered = false;

  // Função para alternar a visibilidade da lista de participantes
  const toggleParticipants = () => {
    showParticipants = !showParticipants;
  };

  // Armazena respostas selecionadas para questões de múltipla escolha
  let selectedAnswers: Record<string, string[]> = {};

  const toggleAnswers = () => {
    showAnswers = !showAnswers;
  };

    // Verificar se o usuário já respondeu à pesquisa
    async function checkIfUserAnswered() {
    try {
      const currentUserId = get(currentUser)?.id;

      if (currentUserId) {
        const responses = await pb.collection('pollAnswers').getList(1, 1, {
          filter: `poll = "${data.poll.id}" && user = "${currentUserId}"`,
        });

        userAlreadyAnswered = responses.totalItems > 0;
      }
    } catch (error) {
      console.error("Erro ao verificar resposta do usuário:", error);
    }
  }

  // Enviar respostas para questões do tipo "single"
  const submitSingleAnswer = async (questionId: string, selectedOptionKey: string) => {
    try {
      const newAnswer = {
        poll: data.poll.id,
        user: get(currentUser)?.id,
        question: questionId,
        answer: selectedOptionKey,
      };

      await pb.collection('pollAnswers').create(newAnswer);
      userAlreadyAnswered = true; // Atualiza o status após a resposta
    } catch (error) {
      console.error("Erro ao registrar resposta:", error);
    }
  };

  // Enviar respostas para questões do tipo "multiple"
  const submitMultipleAnswers = async (questionId: string) => {
    try {
      const currentUserId = get(currentUser)?.id;

      if (selectedAnswers[questionId] && currentUserId) {
        const responses = selectedAnswers[questionId].map((answer) => ({
          poll: data.poll.id,
          user: currentUserId,
          question: questionId,
          answer,
        }));

        // Enviar respostas em lote
        await Promise.all(responses.map((response) => pb.collection('pollAnswers').create(response)));

        userAlreadyAnswered = true; // Atualiza o status após a resposta
        selectedAnswers[questionId] = []; // Limpa as respostas
      }
    } catch (error) {
      console.error("Erro ao registrar respostas múltiplas:", error);
    }
  };

    // Atualizar as respostas selecionadas para questões do tipo "multiple"
    const handleMultipleSelection = (questionId: string, optionValue: string, isSelected: boolean) => {
    if (!selectedAnswers[questionId]) {
      selectedAnswers[questionId] = [];
    }

    if (isSelected) {
      selectedAnswers[questionId].push(optionValue);
    } else {
      selectedAnswers[questionId] = selectedAnswers[questionId].filter((value) => value !== optionValue);
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

  onMount(() => {
    checkIfUserAnswered();
  });

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
    {#if userAlreadyAnswered}
      <!-- Caso o usuário já tenha respondido -->
      <div class="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow">
        <p class="text-lg font-semibold">A pesquisa já foi respondida.</p>
      </div>
    {:else}
      <!-- Caso o usuário não tenha respondido -->
      <div class="mt-4 space-y-4">
        {#each data.questions as question (question.id)}
          <div class="mb-4 p-4 bg-white rounded-lg shadow-md">
            <h5 class="text-xl font-semibold text-gray-800">{question.question.ops[0].insert}</h5>
            <div class="mt-2">
              {#if question.options.kind === 'multiple'}
                <!-- Respostas para questões múltiplas -->
                {#each question.options.entries as option}
                  <label class="flex items-center space-x-3 mb-2">
                    <input
                      type="checkbox"
                      value={option.value}
                      on:change={(event) =>
                        handleMultipleSelection(question.id, option.value, event.target.checked)
                      }
                      class="h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                    <span class="text-lg text-gray-700">{option.key}</span>
                  </label>
                {/each}
                <button
                  class="btn btn-primary mt-2"
                  on:click={() => submitMultipleAnswers(question.id)}
                >
                  Enviar Respostas
                </button>
              {:else}
                <!-- Respostas para questões únicas -->
                {#each question.options.entries as option}
                  <label class="flex items-center space-x-3 mb-2">
                    <input
                      type="radio"
                      name="answer"
                      value={option.value}
                      on:change={() => submitSingleAnswer(question.id, option.value)}
                      class="h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                    <span class="text-lg text-gray-700">{option.key}</span>
                  </label>
                {/each}
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
  </div>
</PageGrid>
