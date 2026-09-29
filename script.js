const API_URL = "http://127.0.0.1:5000/games";

const results = document.getElementById("results");
const loading = document.getElementById("loading");
const addGameForm = document.getElementById("addGameForm");
const formMessage = document.getElementById("formMessage");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");


// Show loading message
function showLoading(show) {
  loading.classList.toggle("active", show);
}


// Escape text before putting it into HTML
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}


// GET /games
async function fetchGames() {
  showLoading(true);
  results.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Could not load games.");
    }

    const games = await response.json();
    displayGames(games);

  } catch (error) {
    results.innerHTML = `
      <div class="error-message">
        ${escapeHTML(error.message)}
      </div>
    `;
  } finally {
    showLoading(false);
  }
}


// Display games
function displayGames(games) {
  if (games.length === 0) {
    results.innerHTML = `
      <div class="error-message">
        No games found.
      </div>
    `;
    return;
  }

  games.forEach((game) => {
    const card = document.createElement("article");
    card.className = "result-card";

    card.innerHTML = `
      <div class="game-info">

        <h2>${escapeHTML(game.title)}</h2>

        <p><strong>Genre:</strong> ${escapeHTML(game.genre)}</p>
        <p><strong>Platform:</strong> ${escapeHTML(game.platform)}</p>
        <p><strong>Release Year:</strong> ${escapeHTML(game.release_year)}</p>

        <div class="game-buttons">

          <button onclick="viewGame(${game.id})">
            VIEW
          </button>

          <button onclick="editGame(${game.id})">
            EDIT
          </button>

          <button onclick="deleteGame(${game.id})">
            DELETE
          </button>

        </div>

      </div>
    `;

    results.appendChild(card);
  });
}


// GET /games/:id
async function viewGame(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (response.status === 404) {
      alert("Game not found.");
      return;
    }

    if (!response.ok) {
      throw new Error("Could not load game.");
    }

    const game = await response.json();

    alert(
      `Title: ${game.title}\n` +
      `Genre: ${game.genre}\n` +
      `Platform: ${game.platform}\n` +
      `Release Year: ${game.release_year}`
    );

  } catch (error) {
    alert(error.message);
  }
}


// POST /games
addGameForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  formMessage.textContent = "";

  const game = {
    title: document.getElementById("titleInput").value.trim(),
    genre: document.getElementById("genreInput").value.trim(),
    platform: document.getElementById("platformInput").value.trim(),
    release_year: Number(document.getElementById("yearInput").value)
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(game)
    });

    const data = await response.json();

    if (response.status === 400) {
      formMessage.textContent = data.error;
      return;
    }

    if (!response.ok) {
      throw new Error("Could not add game.");
    }

    formMessage.textContent = "Game added successfully.";

    addGameForm.reset();

    fetchGames();

  } catch (error) {
    formMessage.textContent = error.message;
  }
});


// PUT /games/:id
let editingGameId = null;

const editModal = document.getElementById("editModal");
const editGameForm = document.getElementById("editGameForm");
const closeModal = document.getElementById("closeModal");
const cancelEdit = document.getElementById("cancelEdit");
const editMessage = document.getElementById("editMessage");


// Open edit modal
async function editGame(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (response.status === 404) {
      alert("Game not found.");
      return;
    }

    if (!response.ok) {
      throw new Error("Could not load game.");
    }

    const game = await response.json();

    editingGameId = id;

    document.getElementById("editTitle").value = game.title;
    document.getElementById("editGenre").value = game.genre;
    document.getElementById("editPlatform").value = game.platform;
    document.getElementById("editYear").value = game.release_year;

    editMessage.textContent = "";
    editModal.classList.add("active");

  } catch (error) {
    alert(error.message);
  }
}


// Save edited game
editGameForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const updatedGame = {
    title: document.getElementById("editTitle").value.trim(),
    genre: document.getElementById("editGenre").value.trim(),
    platform: document.getElementById("editPlatform").value.trim(),
    release_year: Number(document.getElementById("editYear").value)
  };

  try {
    const response = await fetch(`${API_URL}/${editingGameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedGame)
    });

    const data = await response.json();

    if (response.status === 400) {
      editMessage.textContent = data.error;
      return;
    }

    if (response.status === 404) {
      editMessage.textContent = "Game not found.";
      return;
    }

    if (!response.ok) {
      throw new Error("Could not update game.");
    }

    editModal.classList.remove("active");

    fetchGames();

  } catch (error) {
    editMessage.textContent = error.message;
  }
});


// Close edit modal
closeModal.addEventListener("click", () => {
  editModal.classList.remove("active");
});


// Cancel edit
cancelEdit.addEventListener("click", () => {
  editModal.classList.remove("active");
});


// DELETE /games/:id
async function deleteGame(id) {
  const confirmed = confirm("Are you sure you want to delete this game?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (response.status === 404) {
      alert("Game not found.");
      return;
    }

    if (!response.ok) {
      throw new Error("Could not delete game.");
    }

    alert(data.message);

    fetchGames();

  } catch (error) {
    alert(error.message);
  }
}


// Search games by title
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim().toLowerCase();

  if (!searchTerm) {
    fetchGames();
    return;
  }

  showLoading(true);
  results.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Could not load games.");
    }

    const games = await response.json();

    const filteredGames = games.filter((game) =>
      game.title.toLowerCase().includes(searchTerm)
    );

    displayGames(filteredGames);

  } catch (error) {
    results.innerHTML = `
      <div class="error-message">
        ${escapeHTML(error.message)}
      </div>
    `;
  } finally {
    showLoading(false);
  }
});


// Load games when page opens
fetchGames();