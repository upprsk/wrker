<script>
  import { defaults } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import RegisterForm from './register-form.svelte';
  import { zRegisterSchema } from './schema';
</script>

<div class="flex h-full items-center justify-center">
  <div class="card w-96 bg-base-100 shadow-xl">
    <RegisterForm data={defaults(zod(zRegisterSchema))} />
  </div>
</div>
