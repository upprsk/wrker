<script>
    let isLogin = true;
    let email = '';
    let password = '';
    let confirmPassword = '';

    const toggleForm = () => {
        isLogin = !isLogin;
        email = '';
        password = '';
        confirmPassword = '';
    };

    const handleSubmit = () => {
        if (isLogin) {
            // Lógica para login
            console.log('Login com', { email, password });
        } else {
            // Lógica para cadastro
            if (password === confirmPassword) {
                console.log('Cadastro com', { email, password });
            } else {
                alert('As senhas não coincidem!');
            }
        }
    };
</script>

<div class="fundo clearfix">

<div class="banner">
    imagem
</div>

<div class="container">
    <h1>{isLogin ? 'Login' : 'Cadastro'}</h1>
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Senha" required />
    
    {#if !isLogin}
        <input type="password" bind:value={confirmPassword} placeholder="Confirme a Senha" required />
    {/if}

    <button on:click={handleSubmit}>
        {isLogin ? 'Entrar' : 'Cadastrar'}
    </button>

    <div class="toggle">
        <a href="#" on:click|preventDefault={toggleForm}>
            {isLogin ? 'Criar uma conta' : 'Já tem uma conta? Faça login'}
        </a>
    </div>
</div>

</div>

<style>

    .banner {
        float: left;
        background-image: none;
        text-align: center center;
    }

    .clearfix::after {
        content: "";
        display: table;
        clear: both;
    }
    .fundo {
        background-color: rgb(23, 219, 150);
    }

    .container {
        float: right;
        max-width: 400px;
        margin: 20% auto ;
        padding: 2rem;
        background-color: #6b8fab;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        clear: both;
    }
    .container h1 {
        color: #e1e1e1;
        text-align: center;

    }
    input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        width: 100%;
        padding: 0.5rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
    .toggle {
        margin-top: 1rem;
        text-align: center;
    }
</style>


