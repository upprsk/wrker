<script>
    let teste = 'Isso daqui é um Teste!';
    let count = 0;

    function increment() {
		count += 1;
	}
</script>

<h1 class="classeTeste"> {teste} </h1>

<button on:click={increment}>
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>

<style>
    .classeTeste {
        color: #fad45f;
        background-color: black;
        text-align: center;
    }
</style>
