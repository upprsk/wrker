<script lang="ts">
  import PageGrid from '$lib/components/page-grid.svelte';
  import Quill from '$lib/components/quill.svelte';
  import { pb } from '$lib/pocketbase.js';
  import { currentUser } from '$lib/stores/user.js';
  import * as notif from '$lib/stores/notif';
  import { invalidate } from '$app/navigation';
  import Question from './Question.svelte';
  import { zUserSchema } from '$lib/models';
  import { onMount } from 'svelte';

  export let data;

  // Definir o tipo de audienceUsernames
  let audienceUsernames: { id: string; fullName: string }[] = [];

  // Para controlar qual aba está visível (descrição ou respostas)
  let showAnswers = false;

  // Função para exibir/ocultar a aba de respostas
  const toggleAnswers = () => {
    showAnswers = !showAnswers;
  };

  // Função para enviar a resposta
  const submitAnswer = async (questionId: string, selectedOptionKey: string) => {
  try {
    // Preparar o objeto de nova resposta
    const newAnswer = {
      poll: data.poll.id,
      user: currentUser,  // Usuário que está respondendo
      question: questionId,  // ID da pergunta
      answer: selectedOptionKey,  // A chave da opção escolhida
    };

    // Enviar a resposta para o banco de dados
    await pb.collection('poll_answers').create(newAnswer);
    notif.addMessage({ kind: 'info', message: 'Resposta registrada com sucesso.' });

    invalidate('app:poll'); // Atualiza a página para mostrar a resposta
  } catch (error: unknown) {
    if (error instanceof Error) {
      notif.addMessage({ kind: 'error', message: 'Erro ao registrar resposta.', details: error.message });
    } else {
      notif.addMessage({ kind: 'error', message: 'Erro desconhecido ao registrar resposta.' });
    }
  }
};



  // Função para buscar os usuários do banco de dados e armazenar o id e username
  async function fetchUsers() {
    const zUserArraySchema = zUserSchema.array();
    const usersInBD = await pb
      .collection('users')
      .getFullList({ fetch, filter: pb.filter('id!={:self}', { self: currentUser }) })
      .then((l) => zUserArraySchema.parse(l));

    // Mapear apenas id e username dos usuários para facilitar a comparação
    return usersInBD.map(user => ({ id: user.id, fullName: user.fullName }));
  }

  // Chamar a função fetchUsers ao montar o componente e salvar os dados dos usuários no array
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

      <button class="btn btn-warning btn-xs  rounded-lg hover:text-white">remover</button>
      {#if data.poll.open}
        <button class="btn btn-warning btn-xs rounded-lg hover:text-white" on:click={() => openOrClose(false)}>encerrar</button>
      {:else}
        <button class="btn btn-warning btn-xs rounded-lg hover:text-white" on:click={() => openOrClose(true)}>iniciar</button>
      {/if}
    {/if}
  </svelte:fragment>

  <div class="card mx-auto my-5 bg-base-100">
    <div class="card-body">
      <h4 class="card-title">{data.poll.name}</h4>

      <!-- Descrição da pesquisa -->
      <Quill contents={data.poll.description} readOnly showControls={false} />
      
      <!-- Mostrar lista de participantes -->
      <div class="font-bold text-lg mt-2 text-black-600">
        Participantes:
      </div>
      <ul class="pl-2 mt-2">
        {#each data.poll.audience as audiencia}
          {#each audienceUsernames as user}
            {#if audiencia === user.id}
              <li class="inline-block text-gray-700 before:content-[''] before:mr-2 hover:bg-gray-200 p-1 rounded mr-2">
                {user.fullName}
              </li>
            {/if}
          {/each}
        {/each}
      </ul>

      <!-- Botão para alternar entre abas -->
      <div class="mt-4">
        <button on:click={toggleAnswers} class="btn btn-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          {showAnswers ? 'Ver Descrição' : 'Responder Pesquisa'}
        </button>
      </div>

      <!-- Exibição de perguntas e respostas -->
      {#if showAnswers}
        <div class="mt-4">
          {#each data.questions as question (question.id)}
  <div>
    <h5>{question.question}</h5>
    <div>
      {#each question.options.entries as option}
        <label>
          <input 
            type={question.options.kind === 'multiple' ? 'checkbox' : 'radio'}
            name="answer"
            value={option.key}
            on:change={() => submitAnswer(question.id, option.key)}
          />
          {option.value}
        </label>
      {/each}
    </div>
  </div>
{/each}
        </div>
      {/if}
    </div>
  </div>
</PageGrid>