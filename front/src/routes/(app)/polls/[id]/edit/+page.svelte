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


    // Função para alterar o estado da pesquisa usando action
    const openOrClose = async (newStatus: boolean) => {
    try {
      const updatedData = { ...data.poll, open: newStatus };
      await action(updatedData);
      data.poll.open = newStatus; // Atualiza localmente o estado de `open`
    } catch (error) {
      console.error('Erro ao alterar o status da pesquisa:', error);
    }
  };
</script>

<PageGrid>
  <ul slot="breadcrumbs">
    <li><a class="hover:text-white" href="/">Home</a></li>
    <li><a class="hover:text-white" href="/polls">Pesquisas</a></li>
    <li><a class="hover:text-white" href="/polls/{data.poll.id}">{data.poll.name}</a></li>
    <li><a class="hover:text-white" href="/polls/{data.poll.id}/edit">Editar</a></li>
  </ul>

  <svelte:fragment slot="actions">
    <a href="questions" class="btn btn-primary btn-xs rounded-lg hover:text-white">Editar perguntas</a>

    {#if data.poll.owner === $currentUser?.id}
    <button class="btn btn-warning btn-xs rounded-lg hover:text-white">Deletar Pesquisa</button>

    {#if data.poll.open}
      <button class="btn btn-warning btn-xs rounded-lg hover:text-white" on:click={() => openOrClose(false)}>
        Encerrar
      </button>
    {:else}
      <button class="btn btn-warning btn-xs rounded-lg hover:text-white" on:click={() => openOrClose(true)}>
        Iniciar
      </button>
    {/if}
  {/if}
  </svelte:fragment>

  <div class="card mx-auto my-5 bg-base-100">
    <PollForm data={data.form} users={data.users} {action}>Editar Pesquisa</PollForm>
  </div>
</PageGrid>
