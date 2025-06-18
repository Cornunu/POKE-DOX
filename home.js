const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("search");
const spriteStyle = document.getElementById("spriteStyle");
const notification = document.getElementById("notification");

let allPokemon = [];

async function fetchPokemon(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function loadPokedex() {
  for (let i = 1; i <= 151; i++) {
    const pokemon = await fetchPokemon(i);
    allPokemon.push(pokemon);
    displayPokemon(pokemon);
  }
}

function displayPokemon(pokemon) {
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");

  const spriteURL = spriteStyle.value === "pixel"
    ? pokemon.sprites.front_default
    : pokemon.sprites.other["official-artwork"].front_default;

  pokemonEl.innerHTML = `
    <h3>#${pokemon.id.toString().padStart(3, "0")} - ${pokemon.name}</h3>
    <img src="${spriteURL}" alt="${pokemon.name}" />
  `;

  pokedex.appendChild(pokemonEl);
}

searchInput.addEventListener("input", () => {
  const search = searchInput.value.toLowerCase();
  pokedex.innerHTML = "";
  const filtered = allPokemon.filter(p =>
    p.name.toLowerCase().includes(search) || p.id.toString() === search
  );
  filtered.forEach(displayPokemon);

  if (filtered.length === 0) {
    notification.textContent = "Pokémon não encontrado!";
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 2500);
  }
});

spriteStyle.addEventListener("change", () => {
  pokedex.innerHTML = "";
  allPokemon.forEach(displayPokemon);
});

loadPokedex();
