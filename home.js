const container = document.getElementById("pokemon-dia");

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

function savePokemonDia(pokemon) {
  const key = getTodayKey();
  localStorage.setItem("pokemon_dia_data", JSON.stringify({ key, pokemon }));
}

function getSavedPokemonDia() {
  const data = JSON.parse(localStorage.getItem("pokemon_dia_data"));
  if (!data) return null;
  return data.key === getTodayKey() ? data.pokemon : null;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadPokemonDia() {
  const saved = getSavedPokemonDia();
  if (saved) {
    mostrarPokemon(saved);
    return;
  }

  const randomId = Math.floor(Math.random() * 898) + 1; // até Gen 8
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const data = await res.json();

  const pokemon = {
    id: data.id,
    name: capitalize(data.name),
    image: data.sprites.other["official-artwork"].front_default,
  };

  savePokemonDia(pokemon);
  mostrarPokemon(pokemon);
}

function mostrarPokemon(pokemon) {
  container.innerHTML = `
    <h2>Pokémon do Dia</h2>
    <img src="${pokemon.image}" alt="${pokemon.name}" />
    <h3>${pokemon.name} <span>#${pokemon.id.toString().padStart(3, "0")}</span></h3>
  `;
}

loadPokemonDia();
