<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import Appbar from './appbar.svelte';
  import Drawer from './drawer.svelte';
  import * as notif from '$lib/stores/notif';

  const logout = () => {
    pb.authStore.clear();
    notif.addMessage({ kind: 'info', message: 'Voce saiu da sua conta' });
  };
</script>

<Drawer let:drawerId on:logout={logout}>
  <Appbar drawerInputId={drawerId} />
  <slot />
</Drawer>
