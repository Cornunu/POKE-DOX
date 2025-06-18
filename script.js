document.addEventListener('DOMContentLoaded',()=> {
  const popup=document.getElementById('welcomePopup');
  setTimeout(()=>popup.remove(),2000);

  const GRID=document.getElementById('grid'),
        DETAIL=document.getElementById('detail'),
        searchInput=document.getElementById('searchInput'),
        toggleBtn=document.getElementById('toggleView');

  let viewMode='normal', allPokemons=[], typesChart;

  toggleBtn.onclick=()=>{ viewMode = viewMode==='normal'?'pixel':'normal'; renderGrid(allPokemons); }

  searchInput.addEventListener('keydown',e=>{
    if(e.key==='Enter') searchPokemon(searchInput.value.trim());
  });

  async function loadAll() {
    const res=await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
    const list=(await res.json()).results;
    for(const entry of list) {
      const d=await fetch(entry.url).then(r=>r.json());
      allPokemons.push(d);
      if(allPokemons.length<=2) renderGrid(allPokemons);
    }
    renderGrid(allPokemons);
  }

  async function searchPokemon(q) {
    try {
      const p=await fetch(`https://pokeapi.co/api/v2/pokemon/${q.toLowerCase()}`).then(r=>r.json());
      const species=await fetch(p.species.url).then(r=>r.json());
      const evoChain=await fetch(species.evolution_chain.url).then(r=>r.json());
      const gen=species.generation.name;
      const regionUrl=species.pokedex_numbers[0].pokedex.url;
      const region=(await fetch(regionUrl).then(r=>r.json())).region.name;
      const desc=species.flavor_text_entries.find(e=>e.language.name==='pt')?.flavor_text || species.flavor_text_entries.find(e=>e.language.name==='en').flavor_text;

      const evos=[];
      function recurse(chain){ evos.push(chain.species.name); chain.evolves_to.forEach(recurse);}
      recurse(evoChain.chain);

      loadTypeChart();
      const weak=typesChart[p.types[0].type.name].weak;

      DETAIL.innerHTML=`
        <button id="back">« Voltar</button>
        <h2>#${String(p.id).padStart(3,'0')} ${p.name.toUpperCase()}</h2>
        <img src="${viewMode==='normal'?p.sprites.other['official-artwork'].front_default:p.sprites.front_default}" class="${viewMode}"/>
        <p><strong>Tipos:</strong> ${p.types.map(t=>t.type.name).join(', ')}</p>
        <p><strong>Fraquezas:</strong> ${weak.join(', ')}</p>
        <p><em>${desc.replace(/\n|\f/g,' ')}</em></p>
        <p><strong>Geração:</strong> ${gen}, <strong>Região:</strong> ${region}</p>
        <p><strong>Evoluções:</strong> ${evos.join(' → ')}</p>
      `;
      DETAIL.classList.remove('hidden'); GRID.classList.add('hidden');
      document.getElementById('back').onclick=()=>{ DETAIL.classList.add('hidden'); GRID.classList.remove('hidden'); }
    } catch(e){ alert('Pokémon não encontrado'); }
  }

  async function loadTypeChart() {
    if(typesChart) return;
    const typesRes=await fetch('https://pokeapi.co/api/v2/type').then(r=>r.json());
    typesChart={};
    for(const tEntry of typesRes.results) {
      const tD=await fetch(tEntry.url).then(r=>r.json());
      typesChart[tD.name]={weak:tD.damage_relations.double_damage_from.map(x=>x.name)};
    }
  }

  function renderGrid(list) {
    GRID.innerHTML='';
    list.forEach(p=>{
      const div=document.createElement('div');
      div.className='card';
      div.innerHTML=`
        <img src="${viewMode==='normal'?p.sprites.other['official-artwork'].front_default:p.sprites.front_default}" alt="${p.name}"/>
        <p>#${String(p.id).padStart(3,'0')} ${p.name.toUpperCase()}</p>`;
      div.onclick=()=>searchPokemon(p.name);
      GRID.appendChild(div);
    });
  }

  loadAll();
});
