<script lang="ts">
  import { goto } from '$app/navigation';
  import PageGrid from '$lib/components/page-grid.svelte';
  import PollForm from '$lib/components/poll-form.svelte';
  import { pb } from '$lib/pocketbase';
  import { zEditPollSchema } from '$lib/schemas.js';
  import * as notif from '$lib/stores/notif';
  import { currentUser } from '$lib/stores/user';
  import { defaults, type Infer } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';

  export let data;

  const action = async (data: Infer<typeof zEditPollSchema>) => {
    const res = await pb.collection('polls').create({ ...data, owner: $currentUser?.id });
    notif.addMessage({
      kind: 'info',
      message: 'Pesquisa criada',
      // details: `Entrou como ${res.record.fullName}`,
    });

    goto(`/polls/${res.id}`);
  };
</script>

<PageGrid>
  <ul slot="breadcrumbs">
    <li><a href="/">Home</a></li>
    <li><a href="/polls">Pesquisas</a></li>
    <li><a href="/polls/new">Nova Pesquisa</a></li>
  </ul>

  <svelte:fragment slot="actions">
    <a href="../" class="btn btn-error btn-xs">cancelar</a>
  </svelte:fragment>

  <div class="card mx-auto my-5 bg-base-100">
    <PollForm data={defaults(zod(zEditPollSchema))} users={data.users} {action}
      >Nova Pesquisa</PollForm
    >
  </div>
</PageGrid>
