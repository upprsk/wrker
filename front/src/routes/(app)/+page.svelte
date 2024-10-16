<script lang="ts">
  import { currentUser } from '$lib/stores/user';
</script>

<h1>
  Sugestão de onde o logo da empresa capitalis poderia ficar. Só teria que alterar o fundo cinza talvez
</h1>

{#if $currentUser}
  {$currentUser.fullName}
{/if}
