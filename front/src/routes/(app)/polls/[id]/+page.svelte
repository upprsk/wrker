<script lang="ts">
  import PageGrid from '$lib/components/page-grid.svelte';
  import Quill from '$lib/components/quill.svelte';
  import { pb } from '$lib/pocketbase.js';
  import { currentUser } from '$lib/stores/user.js';
  import * as notif from '$lib/stores/notif';
  import { invalidate } from '$app/navigation';

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
      <a href="edit" class="btn btn-primary btn-xs">editar</a>

      <button class="btn btn-warning btn-xs">remover</button>
      {#if data.poll.open}
        <button class="btn btn-warning btn-xs" on:click={() => openOrClose(false)}>encerrar</button>
      {:else}
        <button class="btn btn-warning btn-xs" on:click={() => openOrClose(true)}>iniciar</button>
      {/if}
    {/if}
  </svelte:fragment>

  <div class="card mx-auto my-5 bg-base-100">
    <div class="card-body">
      <h4 class="card-title">{data.poll.name}</h4>

      <Quill contents={data.poll.description} readOnly showControls={false} />
    </div>
  </div>
</PageGrid>
