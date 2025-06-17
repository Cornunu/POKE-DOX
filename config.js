const pokeContainer = document.getElementById("pokemon-container");
const notification = document.getElementById("notification");
const alertaCentral = document.getElementById("alerta-central");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const langSelect = document.getElementById("langSelect");
const layoutSelect = document.getElementById("layoutSelect");

let language = navigator.language.startsWith("pt") ? "pt" : "en"; // idioma padrão detectado
let layout = "normal";

langSelect.value = "auto";
layoutSelect.value = "normal";

langSelect.addEventListener("change", () => {
  if (langSelect.value === "auto") {
    language = navigator.language.startsWith("pt") ? "pt" : "en";
  } else {
    language = langSelect.value;
  }
});

layoutSelect.addEventListener("change", () => {
  layout = layoutSelect.value;
  pokeContainer.className = layout; // aplica classe para grid layout
});

searchBtn.addEventListener("click", buscarPokemon);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarPokemon();
});

async function buscarPokemon() {
  const query = searchInput.value.toLowerCase().trim();
  pokeContainer.innerHTML = "";
  alertaCentral.style.display = "none";

  if (!query) {
    showAlertaCentral(language === "pt" ? "⚠️ Pokémon aleatório selecionado!" : "⚠️ Random Pokémon selected!");
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    if (!response.ok) throw new Error("Pokémon não encontrado");

    const pokemon = await response.json();
    const speciesResp = await fetch(pokemon.species.url);
    const species = await speciesResp.json();

    // Descrição no idioma escolhido ou fallback
    let descriptionObj = species.flavor_text_entries.find(entry => entry.language.name === language);
    if (!descriptionObj) {
      descriptionObj = species.flavor_text_entries.find(entry => entry.language.name === "en");
    }
    const description = descriptionObj ? descriptionObj.flavor_text.replace(/\f|\n/g, " ") : (language === "pt" ? "Sem descrição." : "No description.");

    // Tipos
    const types = pokemon.types.map(t => t.type.name);

    // Stats formatados
    const statsFormatted = pokemon.stats.map(stat => `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`).join(" | ");

    // Imagens conforme layout
    let imageNormal, imageShiny;
    if (layout === "normal") {
      imageNormal = pokemon.sprites.other["official-artwork"].front_default;
      imageShiny = pokemon.sprites.other["official-artwork"].front_shiny;
    } else {
      imageNormal = pokemon.sprites.front_default;
      imageShiny = pokemon.sprites.front_shiny;
    }

    pokeContainer.innerHTML = `
      <article class="pokemon-card">
        <h2><img src="sr2a947c8f967b8.png" alt="Pokébola" /> ${capitalize(pokemon.name)} <span>#${pokemon.id.toString().padStart(3,"0")}</span></h2>
        <div class="pokemon-info">
          <div class="type-list types">
            ${types.map(t => `<span>${t}</span>`).join("")}
          </div>
          <div class="stats">${statsFormatted}</div>
          <p><strong>${language === "pt" ? "Descrição" : "Description"}:</strong> ${description}</p>
        </div>
        <div class="sprite-container">
          <img src="${imageNormal}" alt="Normal" class="${layout === "normal" ? "normal-art" : "pixel-art"}" />
          <span>🔄</span>
          <img src="${imageShiny}" alt="Shiny" class="${layout === "normal" ? "normal-art" : "pixel-art"}" />
        </div>
      </article>
    `;

    showNotification(`${capitalize(pokemon.name)} #${pokemon.id.toString().padStart(3,"0")} ${language === "pt" ? "encontrado!" : "found!"}`);
  } catch {
    showAlertaCentral(language === "pt" ? "❌ Pokémon não encontrado!" : "❌ Pokémon not found!");
  }
}

function showNotification(message) {
  notification.innerHTML = `<img src="sr2a947c8f967b8.png" alt="Pokébola" /> ${message}`;
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 4000);
}

function showAlertaCentral(message) {
  alertaCentral.textContent = message;
  alertaCentral.style.display = "block";
  setTimeout(() => alertaCentral.style.display = "none", 3500);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}