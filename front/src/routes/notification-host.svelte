<script lang="ts">
  import * as notif from '$lib/stores/notif';
  import { messages } from '$lib/stores/notif';
  import { fly } from 'svelte/transition';
</script>

<div class="toast toast-end toast-top">
  {#each $messages as msg (msg.id)}
    <div role="alert" class="alert shadow-lg" out:fly={{ x: 500 }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="h-6 w-6 shrink-0 stroke-info"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div>
        <h3 class="font-bold">{msg.message}</h3>
        {#if msg.details}
          <div class="text-xs">{msg.details}</div>
        {/if}
      </div>
      <button type="button" class="btn btn-square btn-sm" on:click={() => notif.delMessage(msg.id)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- <div class="alert alert-success"> -->
    <!--   <span>Message sent successfully.</span> -->
    <!-- </div> -->
  {/each}
</div>
