<script lang="ts">
  import PageGrid from '$lib/components/page-grid.svelte';
  import PollForm from '$lib/components/poll-form.svelte';
  import { pb } from '$lib/pocketbase.js';
  import type { zEditPollSchema } from '$lib/schemas.js';
  import * as notif from '$lib/stores/notif';
  import { currentUser } from '$lib/stores/user.js';
  import type { Infer } from 'sveltekit-superforms/adapters';

  export let data;

  const action = async (data: Infer<typeof zEditPollSchema>) => {
    const res = await pb.collection('polls').create({ ...data, owner: $currentUser?.id });
    notif.addMessage({
      kind: 'info',
      message: 'Pesquisa atualizada',
      // details: `Entrou como ${res.record.fullName}`,
    });
  };
</script>

<PageGrid>
  <ul slot="breadcrumbs">
    <li><a href="/">Home</a></li>
    <li><a href="/polls">Pesquisas</a></li>
    <li><a href="/polls/{data.poll.id}">{data.poll.name}</a></li>
    <li><a href="/polls/{data.poll.id}/edit">Editar</a></li>
  </ul>

  <svelte:fragment slot="actions">
    <a href="edit" class="btn btn-primary btn-xs">editar</a>

    {#if data.poll.owner === $currentUser?.id}
      <button class="btn btn-warning btn-xs">remover</button>
      <!-- {#if data.poll.open} -->
      <!--   <button class="btn btn-warning btn-xs" on:click={() => openOrClose(false)}>encerrar</button> -->
      <!-- {:else} -->
      <!--   <button class="btn btn-warning btn-xs" on:click={() => openOrClose(true)}>iniciar</button> -->
      <!-- {/if} -->
    {/if}
  </svelte:fragment>

  <div class="card mx-auto my-5 bg-base-100">
    <PollForm data={data.form} {action}>Editar Pesquisa</PollForm>
  </div>
</PageGrid>
