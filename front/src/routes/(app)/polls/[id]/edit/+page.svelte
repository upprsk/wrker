<script lang="ts">
  import PageGrid from '$lib/components/page-grid.svelte';
  import PollForm from '$lib/components/poll-form.svelte';
  import { pb } from '$lib/pocketbase.js';
  import type { EditPollSchema } from '$lib/schemas.js';
  import * as notif from '$lib/stores/notif';
  import { currentUser } from '$lib/stores/user.js';
  import type { Infer } from 'sveltekit-superforms/adapters';

  export let data;

  const action = async (data: Infer<EditPollSchema>) => {
    const closingDate = data.closingDate.split('T').join(' ') + ':00.000Z';
    console.log('saving with closingDate:', data.closingDate, ', and:', closingDate);

    const res = await pb.collection('polls').update(data.id, { ...data, closingDate });
    notif.addMessage({
      kind: 'info',
      message: 'Pesquisa atualizada',
      // details: `Entrou como ${res.record.fullName}`,
    });

    console.log('save poll:', res);
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
    <a href="questions" class="btn btn-primary btn-xs">editar perguntas</a>

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
