<script lang="ts">
  import PageGrid from '$lib/components/page-grid.svelte';
  import { currentUser } from '$lib/stores/user';
  import { getRelativeTimeString } from '$lib/time-delta';

  export let data;
</script>

<PageGrid>
  <ul slot="breadcrumbs">
    <li><a href="/">Home</a></li>
    <li><a href="/polls">Pesquisas</a></li>
  </ul>

  <svelte:fragment slot="actions">
    {#if $currentUser?.role === 'editor'}
      <a href="new" class="btn btn-primary btn-xs">nova</a>
    {/if}
  </svelte:fragment>

  <div class="card mx-auto my-5 bg-base-100">
    <div class="card-body">
      <h4 class="card-title">Pesquisas</h4>

      <div class="overflow-x-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>Nome</th>
              <th>Convidados</th>
              <th>Perguntas</th>
              <th>Termino</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each data.polls as poll (poll.id)}
              {@const questions = data.questions.filter((q) => q.poll === poll.id)}
              <tr class:bg-base-200={poll.open}>
                <td>{poll.name}</td>
                <td>{poll.audience.length} convidado{poll.audience.length !== 1 ? 's' : ''}</td>
                <td>
                  {questions.length} pergunta{questions.length !== 1 ? 's' : ''}
                </td>
                <td>
                  {#if poll.closingDate}
                    <div class="tooltip" data-tip={new Date(poll.closingDate).toLocaleString()}>
                      {getRelativeTimeString(new Date(poll.closingDate))}
                    </div>
                  {:else}
                    <span class="opacity-50">---</span>
                  {/if}
                </td>
                <td>
                  {#if poll.owner === $currentUser?.id}
                    <a href="{poll.id}/edit" class="btn btn-primary btn-xs">editar</a>
                  {/if}

                  <a href={poll.id} class="btn btn-ghost btn-xs">detalhes</a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</PageGrid>
