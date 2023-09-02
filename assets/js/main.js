/*
function convertPokemonTypesToLI(pokemonTypes){
    return pokemonTypes.map((typeSlot) => `<li class="type">${type}</li>`)
}*/

// Estou buscando o meu OL no index.html chamado pokemonLIST
const pokemonList = document.getElementById('pokemonList')
const backButton = document.querySelector('#back')
const frame = document.querySelector('#frame')
const loadMoreButton = document.getElementById('loadMoreButton')
const pagination = document.querySelector('.pagination')


const limit = 10
let offset = 0;
const maxRecords  = 151


function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function calcStatsInfo(value) {
    const baseValue = 255
    const calculateValue = (value / baseValue) * 100
    const valueCalculated = Math.round(calculateValue)
    return valueCalculated
}

function calculateWeightOrHeight(value) {
    return value / 10
}

function convertPokToCardDesc(pokemon) {
    return `
    <div class="pokemon-card">
    <div class="pokemon-content ${pokemon.type}">
      <div class="pokemon-content-top">
        <div class="info-top">
          <span class="pokemon-name">${pokemon.name}</span>
          <span class="pokemon-id">#${pokemon.number.toString().padStart(3, 0)}</span>
        </div>
        <div class="pokemon-types">
            <div class="pokemon-types_types">
                ${pokemon.types.map((type) => `<span class="types-type ${type}">${type}</span>`).join('')}
            </div>
          </div>
        <div class="pokemon-image">
          <img
            src="${pokemon.photo}"
            alt="${pokemon.name}" />
        </div>
      </div>
      <div class="pokemon-content-bottom">
        <div class="title-about">About</div>
        <div class="info-about">
          <div class="info-about-name">Height</div>
          <div>${calculateWeightOrHeight(pokemon.height)} m</div>
          <div class="info-about-name">Weight</div>
          <div>${calculateWeightOrHeight(pokemon.weight)} kg</div>
          <div class="info-about-name">Abilities</div>
          <div>${pokemon.abilities.join(', ')}</div>
        </div>
        <div class="title-base-stats">Status</div>
        <div class="info-base-stats">
          <div class="stats-name">HP</div>
          <div class="stats-value">${pokemon.stats[0]}</div>
          <div class="outer">
            <div class="inner ${pokemon.type}" style="width: ${calcStatsInfo(pokemon.stats[0])}%;"></div>
          </div>
          <div class="stats-name">Attack</div>
          <div class="stats-value">${pokemon.stats[1]}</div>
          <div class="outer">
            <div class="inner ${pokemon.type}" style="width: ${calcStatsInfo(pokemon.stats[1])}%;"></div>
          </div>
          <div class="stats-name">Defense</div>
          <div class="stats-value">${pokemon.stats[2]}</div>
          <div class="outer">
            <div class="inner ${pokemon.type}" style="width: ${calcStatsInfo(pokemon.stats[2])}%;"></div>
          </div>
          <div class="stats-name">Sp. Atk</div>
          <div class="stats-value">${pokemon.stats[3]}</div>
          <div class="outer">
            <div class="inner ${pokemon.type}" style="width: ${calcStatsInfo(pokemon.stats[3])}%;"></div>
          </div>
          <div class="stats-name">Sp. Def</div>
          <div class="stats-value">${pokemon.stats[4]}</div>
          <div class="outer">
            <div class="inner ${pokemon.type}" style="width: ${calcStatsInfo(pokemon.stats[4])}%;"></div>
          </div>
          <div class="stats-name">Speed</div>
          <div class="stats-value">${pokemon.stats[5]}</div>
          <div class="outer">
            <div class="inner ${pokemon.type}" style="width: ${calcStatsInfo(pokemon.stats[5])}%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `
}

function loadPokemonItens(offset, limit){   
    //SCRIPT ABAIXO É BASICAMENTE O PROCESSO MAIS ALONGANDO NO FINAL DO SCRIPT, FORMA MUITO MAIS RESUMIDA
    //pokeApi.getPokemons() = Promisse   
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => { 
        const newHtml = pokemons.map(convertPokemonToLi).join('')        
        pokemonList.innerHTML += newHtml
        getPokemonData()
        //pokemonList.innerHTML += pokemons.map(convertPokemonToLi).join('') //FORMA ABREVIADA DO QUE ESTA SENDO FEITO NAS 2 LINHAS ACIMA.
    })
}

function getPokemonData() {
    const allPokemons = document.querySelectorAll('.pokemon')
    allPokemons.forEach(pokemon => {
        pokemon.addEventListener('click', () => {
            frame.innerHTML = ''
            pokemonList.classList.add('hidden')
            pagination.classList.add('hidden')
            backButton.classList.remove('hidden')
            const id = pokemon.querySelector('.number').textContent.replace('#', '')
            const number = Number.parseInt(id) - 1
            pokeApi.getPokemons(number, 1).then((poke = []) => {
                const pokemonCard = poke.map(convertPokToCardDesc)
                frame.innerHTML += pokemonCard
                frame.classList.remove('hidden')
            })
        })
    })
}

    
loadPokemonItens(offset,limit)

loadMoreButton.addEventListener('click',() => {
    offset += limit
    const qtdRecordsWithNextPage = offset + limit

    if (qtdRecordsWithNextPage >= maxRecords){
        const newLimit = maxRecords - offset
        loadPokemonItens(offset,newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
        //alert("Não há mais registros")
        //return
    }else{
        loadPokemonItens(offset,limit)
    }
})

backButton.addEventListener('click', () => {
    pokemonList.classList.remove('hidden')
    pagination.classList.remove('hidden')
    backButton.classList.add('hidden')
    frame.classList.add('hidden')
})


/*
//pokemons = [] = GARANTINDO QUE CASO NAO TENHA VALORES, MOSTRE UMA LISTA VAZIA
pokeApi.getPokemons().then((pokemons = []) => {   
    /*
    //Substituindo o For pelo script abaixo
    const newList = pokemons.map((pokemon) => {
        return convertPokemonToLi(pokemon)
    })

    //Juntando meus itens da lista sem separação, representado pelo ('')
    const newHtml = newList.join('')

    //Inserindo a minha lista de texto na lista de pokemnos
    pokemonList.innerHTML += newHtml
    */
   //------------------------------------------------------------------------------------------------------
    /*
    //debugger // VAI PARAR O BREAKPOINT ONDE ESTIVER ESCRITO ESSE DEBUGGER
    const listItem = []
    //CONVERTENDO OBJ DE POKEMONS EM UMA LI EM HTML
    for (let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i];
        listItem.push(convertPokemonToLi(pokemon))
        //pokemonList.innerHTML += convertPokemonToLi(pokemon) //ADICIONANDO OS DEMAIS POKEMONS NO MEU BROWSER, SEM PRECISAR CRIAR VARIAS LINHAS DE COD           
    }
    */
//})









