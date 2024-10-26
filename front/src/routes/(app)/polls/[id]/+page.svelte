<script lang="ts">
  import PageGrid from '$lib/components/page-grid.svelte';
  import Quill from '$lib/components/quill.svelte';
  import { pb } from '$lib/pocketbase.js';
  import { currentUser } from '$lib/stores/user.js';
  import * as notif from '$lib/stores/notif';
  import { invalidate } from '$app/navigation';
  import Question from './Question.svelte';

  export let data;

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
    <li><a href="/">Home</a></li>
    <li><a href="/polls">Pesquisas</a></li>
    <li><a href="/polls/{data.poll.id}">{data.poll.name}</a></li>
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

      <ul class="pl-2 mt-2">
        {#each data.poll.audience as users}
          <li  class="text-gray-700 before:content-['→'] before:mr-2">{users}</li> <!-- ou qualquer outra propriedade que o objeto User tenha -->
        {/each}
      </ul>

      {#each data.questions as question (question.id)}
        {@const answers = data.answers.filter((it) => it.question == question.id)}
        <Question poll={data.poll} {question} {answers} />
      {/each}
    </div>
  </div>
</PageGrid>
