document.addEventListener("DOMContentLoaded", () => {
  // === GERAÇÃO DE ID FIXO POR USUÁRIO ===
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = "user-" + Math.random().toString(36).substr(2, 8);
    localStorage.setItem("userId", userId);
  }

  const idDisplay = document.createElement("div");
  idDisplay.className = "user-id";
  idDisplay.textContent = `Seu ID: ${userId}`;
  document.body.appendChild(idDisplay);

  // === POKÉMON DO DIA ===
  function loadPokemonOfTheDay() {
    const stored = JSON.parse(localStorage.getItem("pokeDay")) || {};
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (stored.timestamp && now - stored.timestamp < oneDay) {
      renderPokeDay(stored.data);
    } else {
      const id = Math.floor(Math.random() * 898) + 1;
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {
          const pokeData = {
            name: data.name.toUpperCase(),
            image: data.sprites.other['official-artwork'].front_default,
          };
          localStorage.setItem("pokeDay", JSON.stringify({
            timestamp: now,
            data: pokeData
          }));
          renderPokeDay(pokeData);
        })
        .catch(err => {
          document.getElementById("pokeDayBox").textContent = "Erro ao carregar.";
        });
    }
  }

  function renderPokeDay(poke) {
    const box = document.getElementById("pokeDayBox");
    box.innerHTML = `
      <h3>${poke.name}</h3>
      <img src="${poke.image}" alt="${poke.name}" />
    `;
  }

  loadPokemonOfTheDay();

  // === DOAÇÃO (MODAL) ===
  const donateBtn = document.getElementById("donateBtn");
  const donateModal = document.getElementById("donateModal");
  const closeDonate = document.getElementById("closeDonate");

  donateBtn.addEventListener("click", () => {
    donateModal.style.display = "block";
    generateQRCode();
  });

  closeDonate.addEventListener("click", () => {
    donateModal.style.display = "none";
  });

  function generateQRCode() {
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
      text: "5a3c5f30-501e-4e72-bd5b-1488f25d7fca",
      width: 128,
      height: 128,
    });

    // Exibe ID no placar (simulação de doação identificada)
    const placar = document.getElementById("placar");
    placar.innerHTML = `<strong>${userId} = 💰</strong> (aguardando valor...)`;
  }

  // Fecha o modal se clicar fora
  window.addEventListener("click", (e) => {
    if (e.target == donateModal) {
      donateModal.style.display = "none";
    }
  });
});
