<script lang="ts">
  import PageGrid from '$lib/components/page-grid.svelte';
  import PollQuestionCard from './poll-question-card.svelte';

  export let data;
</script>

<PageGrid>
  <ul slot="breadcrumbs">
    <li><a href="/">Home</a></li>
    <li><a href="/polls">Pesquisas</a></li>
    <li><a href="/polls/{data.poll.id}">{data.poll.name}</a></li>
    <li><a href="/polls/{data.poll.id}/edit">Editar</a></li>
    <li><a href="/polls/{data.poll.id}/edit/questions">Perguntas</a></li>
  </ul>

  <!-- <svelte:fragment slot="actions"> -->
  <!--   {#if data.poll.owner === $currentUser?.id} -->
  <!--     <button class="btn btn-warning btn-xs">remover</button> -->
  <!--   {/if} -->
  <!-- </svelte:fragment> -->

  {#each data.questions as question (question.id)}
    <PollQuestionCard {question} />
  {/each}

  <div class="mt-24 flex justify-center">
    <a href="new" class="btn btn-primary shadow-xl">Nova Pergunta</a>
  </div>
</PageGrid>
