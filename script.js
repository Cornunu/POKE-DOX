// Dados básicos para teste
const pokemonData = {
  1: {
    name: "Bulbasaur",
    type: ["Grass", "Poison"],
    evolutions: ["Ivysaur", "Venusaur"],
    description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
    region: "Kanto",
    generation: 1,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
  },
  2: {
    name: "Ivysaur",
    type: ["Grass", "Poison"],
    evolutions: ["Venusaur"],
    description: "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.",
    region: "Kanto",
    generation: 1,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png"
  }
};

// Mostrar Pokémon do Dia
function getPokemonOfDay() {
  const keys = Object.keys(pokemonData);
  const index = new Date().getDate() % keys.length;
  return pokemonData[keys[index]];
}

function showPokemonOfDay() {
  const poke = getPokemonOfDay();
  const box = document.getElementById("pokeDayBox");
  box.innerHTML = `
    <h3>${poke.name}</h3>
    <img src="${poke.img}" alt="${poke.name}" />
    <p>${poke.description}</p>
  `;
}

// Montar grid
function renderAllPokemons() {
  const grid = document.getElementById("pokemonGrid");
  grid.innerHTML = "";
  Object.entries(pokemonData).forEach(([id, poke]) => {
    const tile = document.createElement("div");
    tile.className = "pokemon-tile";
    tile.innerHTML = `
      <img src="${poke.img}" alt="${poke.name}" />
      <p>#${id.padStart?.(3, "0") || id} - ${poke.name}</p>
    `;
    tile.onclick = () => showDetails(id);
    grid.appendChild(tile);
  });
}

// Mostrar detalhes
function showDetails(id) {
  const poke = pokemonData[id];
  const section = document.getElementById("pokemonDetails");
  section.style.display = "block";
  section.innerHTML = `
    <h2>${poke.name}</h2>
    <img src="${poke.img}" />
    <p><strong>Tipos:</strong> ${poke.type.join(", ")}</p>
    <p><strong>Evoluções:</strong> ${poke.evolutions.join(" ➝ ")}</p>
    <p><strong>Descrição:</strong> ${poke.description}</p>
    <p><strong>Região:</strong> ${poke.region}</p>
    <p><strong>Geração:</strong> ${poke.generation}</p>
  `;

  // Esconder lista principal
  document.getElementById("pokedex").style.display = "none";
}

// Pesquisar
document.addEventListener("DOMContentLoaded", () => {
  showPokemonOfDay();
  renderAllPokemons();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const val = searchInput.value.toLowerCase();
    const entry = Object.entries(pokemonData).find(
      ([, poke]) => poke.name.toLowerCase() === val
    );
    if (entry) showDetails(entry[0]);
  });
});
