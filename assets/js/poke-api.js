
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default
    //pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight
    const stats = pokeDetail.stats.map(stat => stat.base_stat)
    pokemon.stats = stats

    function capitalize(text)
    {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    const abilities = pokeDetail.abilities.map(ab => new Set().add(capitalize(ab.ability.name)).values().next().value)
    pokemon.abilities = abilities

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailToPokemon)
     
}

pokeApi.getPokemons = (offset = 0 ,limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    /*USAMOS A FUNCAO ARROW => QUANDO QUEREMOS TER UM CALLBACK OU QUANDO NAO QUEREMOS TER UM CONTEXTO ISOLADO, ALEM DE SER UMA SINTAXE MAIS REDUZIDA*/
    //FAZENDO A REQUISICAO HTTP PRA BUSCAR OS POKEMONS
    return fetch(url)
        .then((response) => response.json()) //Transformando A LISTA - Response numa promessa do Body convertida em JSON
        .then((jsonBody) => jsonBody.results) //NOSSA LISTA DE POKEMONS
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) //Transformando a lista em uma nova lista que é a lista de promesses do detalhe do pokemon, em json
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
        //.catch((error) => console.error('Erro ao buscar os dados', error))
}
