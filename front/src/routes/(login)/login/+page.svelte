<script>
  import { defaults } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { zLoginSchema } from './schema';
  import LoginForm from './login-form.svelte';
</script>

<div class="flex h-full items-center justify-center">
  <div class="card w-96 bg-base-100 shadow-xl">
    <LoginForm data={defaults(zod(zLoginSchema))} />
  </div>
</div>
