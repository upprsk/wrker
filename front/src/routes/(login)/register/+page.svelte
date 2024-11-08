<script>
  import { defaults } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import RegisterForm from './register-form.svelte';
  import { zRegisterSchema } from './schema';
</script>

<style>
  /* Estilo para o fundo da página com o mesmo azul */
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
    <RegisterForm data={defaults(zod(zRegisterSchema))} />
  </div>
</div>
