<script lang="ts">
  import PageGrid from '$lib/components/page-grid.svelte';
  import { currentUser } from '$lib/stores/user';
  import { getRelativeTimeString } from '$lib/time-delta';

  export let data;

  // Controla a visibilidade do número de convidados para cada pesquisa
  let showAudienceCount: Record<string, boolean> = {};

  // Alterna a exibição do número de convidados para uma pesquisa específica
  function toggleAudienceCount(pollId: string) {
    showAudienceCount[pollId] = !showAudienceCount[pollId];
  }
</script>

<PageGrid>
  <ul slot="breadcrumbs">
    <li><a href="/" class="hover:text-white">Home</a></li>
    <li><a href="/polls" class="hover:text-white">Pesquisas</a></li>
  </ul>

  <svelte:fragment slot="actions">
    {#if $currentUser?.role === 'editor'}
      <a href="new" class="btn btn-primary btn-xs  rounded-lg hover:text-white  text-base">Nova Pesquisa</a>
    {/if}
  </svelte:fragment>

  <div class="card mx-auto my-5 bg-gradient-to-r from-slate-700 to-gray-300 shadow-lg rounded-lg">
    <div class="card-body text-white">
      <h4 class="card-title text-2xl font-bold">Pesquisas</h4>
  
      <div class="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
        <table class="table w-full border-collapse border border-gray-300 text-gray-700">
          <!-- head -->
          <thead class="bg-gray-100 text-gray-800 text-sm uppercase tracking-wider font-semibold">
            <tr>
              <th class="py-3 px-4 text-left">Nome</th>
              <th class="py-3 px-4 text-left">Convidados</th>
              <th class="py-3 px-4 text-left">Perguntas</th>
              <th class="py-3 px-4 text-left">Termino</th>
              <th class="py-3 px-4 text-left">Status</th>
              <th class="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each data.polls as poll (poll.id)}
              {@const questions = data.questions.filter((q) => q.poll === poll.id)}
              {@const answers = data.answers.filter((a) => a.expand?.question?.poll === poll.id)}
  
              <tr class="hover:bg-gray-50 transition-colors duration-200">
                <td class="py-3 px-4 font-medium">{poll.name}</td>
                <td class="py-3 px-4">{poll.audience.length} convidado{poll.audience.length !== 1 ? 's' : ''}</td>
                <td class="py-3 px-4">
                  {questions.length} pergunta{questions.length !== 1 ? 's' : ''}
                </td>
                <td class="py-3 px-4">
                  {#if poll.closingDate}
                    <div
                      class="tooltip tooltip-bottom text-sm text-gray-600"
                      data-tip={new Date(poll.closingDate).toLocaleString()}
                    >
                      {getRelativeTimeString(new Date(poll.closingDate))}
                    </div>
                  {:else}
                    <span class="opacity-50">---</span>
                  {/if}
                </td>
                <td class="py-3 px-4">
                  {#if $currentUser?.id === poll.owner}
                    {#if poll.audience.length}
                      <span class="badge badge-primary">
                        {(
                          (answers.length / (questions.length * poll.audience.length)) *
                          100
                        ).toFixed(2)}%
                      </span>
                    {:else}
                      <span class="badge badge-secondary">0%</span>
                    {/if}
                  {/if}
                </td>
                <td class="py-3 px-4 text-right space-x-2">
                  {#if poll.owner === $currentUser?.id}
                    <a
                      href="{poll.id}/edit"
                      class="btn btn-primary btn-xs text-sm font-medium rounded-lg hover:bg-blue-600"
                    >
                      Editar
                    </a>
                  {/if}
                  <a
                    href={poll.id}
                    class="btn btn-outline btn-xs text-sm font-medium rounded-lg hover:text-blue-600"
                  >
                    detalhes
                  </a>
                </td>
              </tr>
              {#if showAudienceCount[poll.id]}
                <tr>
                  <td colspan="6" class="py-3 px-4 text-center text-gray-600 bg-gray-50">
                    Número de convidados: {poll.audience.length}
                  </td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
</PageGrid>
