<script lang="ts">
  import { currentUser } from '$lib/stores/user';
</script>

<h1>
  TODO. Go to <a class="link" href="/register">register</a> or
  <a href="/login" class="link">login</a> for now.
</h1>

{#if $currentUser}
  {$currentUser.fullName}
{/if}
