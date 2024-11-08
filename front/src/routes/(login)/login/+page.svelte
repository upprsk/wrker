<script>
  import { defaults } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { zLoginSchema } from './schema';
  import LoginForm from './login-form.svelte';
</script>

<style>
  /* Estilo para o fundo da página */
  body, .page-background {
    background-color: #E0FFFF; 
    height: 100vh;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<div class="page-background">
  <div class="card w-96 bg-base-100 shadow-xl">
    <LoginForm data={defaults(zod(zLoginSchema))} />
  </div>
</div>
