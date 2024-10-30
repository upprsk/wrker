<script lang="ts">
  import PageGrid from '$lib/components/page-grid.svelte';
  import Quill from '$lib/components/quill.svelte';
  import { pb } from '$lib/pocketbase.js';
  import { currentUser } from '$lib/stores/user.js';
  import * as notif from '$lib/stores/notif';
  import { invalidate } from '$app/navigation';
  import Question from './Question.svelte';
  import { zPollSchema, zUserSchema } from '$lib/models';
  import { onMount } from 'svelte';

  export let data;

  // Definir o tipo de audienceUsernames
  let audienceUsernames: { id: string; username: string }[] = [];

  
  // Função para buscar os usuários do banco de dados e armazenar o id e username
  async function fetchUsers() {
    const zUserArraySchema = zUserSchema.array();
    const usersInBD = await pb
      .collection('users')
      .getFullList({ fetch, filter: pb.filter('id!={:self}', { self: currentUser }) })
      .then((l) => zUserArraySchema.parse(l));

    // Mapear apenas id e username dos usuários para facilitar a comparação
    return usersInBD.map(user => ({ id: user.id, username: user.username }));
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

      <Quill contents={data.poll.description} readOnly showControls={false} />
      <div class="font-bold text-lg mt-2 text-black-600">
        Participantes:
      </div>

      <!-- HTML para exibir a lista -->
  <ul class="pl-2 mt-2">
    {#each data.poll.audience as audiencia}
      {#each audienceUsernames as user}
        {#if audiencia === user.id}
          <li class="inline-block text-gray-700 before:content-[''] before:mr-2 hover:bg-gray-200 p-1 rounded mr-2">
            {user.username}
          </li>
        {/if}
      {/each}
    {/each}
  </ul>

      {#each data.questions as question (question.id)}
        {@const answers = data.answers.filter((it) => it.question == question.id)}
        <Question poll={data.poll} {question} {answers} />
      {/each}
    </div>
  </div>
</PageGrid>
