const board = document.getElementById("board");
const generateBtn = document.getElementById("generateBtn");

const TIERS = {
  5: [],
  4: [],
  3: [],
  2: [],
  1: []
};

const usedPokemon = new Set(); // 🔥 tracks duplicates

function getRandomId() {
  return Math.floor(Math.random() * 1025) + 1;
}

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return await res.json();
}

function calculateBST(stats) {
  return stats.reduce((sum, stat) => sum + stat.base_stat, 0);
}

function assignTier(bst) {
  if (bst >= 600) return 5;
  if (bst >= 500) return 4;
  if (bst >= 400) return 3;
  if (bst >= 300) return 2;
  return 1;
}

async function generateBoard() {
  board.innerHTML = "Loading...";
  
  // Reset tiers + used tracker
  for (let tier in TIERS) {
    TIERS[tier] = [];
  }
  usedPokemon.clear();

  let attempts = 0;

  while (
    Object.values(TIERS).some(arr => arr.length < 5) &&
    attempts < 500
  ) {
    attempts++;

    const id = getRandomId();
    const data = await fetchPokemon(id);

    // 🚫 Skip if already used
    if (usedPokemon.has(data.name)) continue;

    const bst = calculateBST(data.stats);
    const tier = assignTier(bst);

    if (TIERS[tier].length < 5) {
      TIERS[tier].push({
        name: data.name,
        sprite: data.sprites.other["official-artwork"].front_default
      });

      usedPokemon.add(data.name); // ✅ mark as used
    }
  }

  renderBoard();
}

function renderBoard() {
  board.innerHTML = "";

  [5,4,3,2,1].forEach(tier => {
    const tierDiv = document.createElement("div");
    tierDiv.classList.add("tier");

    const label = document.createElement("div");
    label.classList.add("tier-label");
    label.textContent = `$${tier}`;
    tierDiv.appendChild(label);

    const row = document.createElement("div");
    row.classList.add("pokemon-row");

    TIERS[tier].forEach(poke => {
      const card = document.createElement("div");
      card.classList.add("pokemon-card");

      const img = document.createElement("img");
      img.src = poke.sprite;


      card.appendChild(img);
      
      row.appendChild(card);
    });

    tierDiv.appendChild(row);
    board.appendChild(tierDiv);
  });
}

generateBtn.addEventListener("click", generateBoard);
generateBoard();
