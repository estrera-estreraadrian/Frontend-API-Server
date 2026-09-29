# Frontend-API-Server

# Video Game Manager

A full-stack video game management application built with a **Flask REST API**, **SQLite**, **HTML**, **CSS**, and **JavaScript**.

The frontend uses the Fetch API to communicate with the backend and allows users to view, add, edit, search, and delete video games.

## Technologies Used

### Backend

* Python
* Flask
* Flask-CORS
* SQLite
* REST API

### Frontend

* HTML
* CSS
* JavaScript
* Fetch API

## Features

The application supports:

* View all games
* View one specific game
* Add a new game
* Edit an existing game
* Delete a game
* Search games by title
* Form validation
* API error handling
* Loading indicator
* Responsive design

## Database

The API uses SQLite to store the video game data.

Each game contains:

* `id` — Unique game ID
* `title` — Game title
* `genre` — Game genre
* `platform` — Gaming platform
* `release_year` — Year the game was released

## API Endpoints

The backend runs at:

```text
http://127.0.0.1:5000
```

### GET All Games

**Method:** `GET`

**Endpoint:**

```text
/games
```

Returns all games in the database.

**Request:**

```text
GET http://127.0.0.1:5000/games
```

**Response:**

```json
[
  {
    "id": 1,
    "title": "Warframe",
    "genre": "Action RPG",
    "platform": "PC",
    "release_year": 2013
  }
]
```

**Status:** `200 OK`

---

### GET One Game

**Method:** `GET`

**Endpoint:**

```text
/games/<id>
```

Returns one game using its ID.

**Request:**

```text
GET http://127.0.0.1:5000/games/1
```

**Response:**

```json
{
  "id": 1,
  "title": "Warframe",
  "genre": "Action RPG",
  "platform": "PC",
  "release_year": 2013
}
```

**Status:** `200 OK`

If the game does not exist:

```json
{
  "error": "Game not found"
}
```

**Status:** `404 Not Found`

---

### POST Create a Game

**Method:** `POST`

**Endpoint:**

```text
/games
```

Adds a new game to the database.

**Request:**

```text
POST http://127.0.0.1:5000/games
```

**Request Body:**

```json
{
  "title": "Minecraft",
  "genre": "Sandbox",
  "platform": "PC",
  "release_year": 2011
}
```

**Response:**

```json
{
  "id": 16,
  "title": "Minecraft",
  "genre": "Sandbox",
  "platform": "PC",
  "release_year": 2011
}
```

**Status:** `201 Created`

---

### PUT Update a Game

**Method:** `PUT`

**Endpoint:**

```text
/games/<id>
```

Updates an existing game.

**Request:**

```text
PUT http://127.0.0.1:5000/games/16
```

**Request Body:**

```json
{
  "title": "Minecraft Java Edition",
  "genre": "Sandbox",
  "platform": "PC",
  "release_year": 2011
}
```

**Response:**

```json
{
  "id": 16,
  "title": "Minecraft Java Edition",
  "genre": "Sandbox",
  "platform": "PC",
  "release_year": 2011
}
```

**Status:** `200 OK`

---

### DELETE a Game

**Method:** `DELETE`

**Endpoint:**

```text
/games/<id>
```

Deletes a game from the database.

**Request:**

```text
DELETE http://127.0.0.1:5000/games/16
```

**Response:**

```json
{
  "message": "Game deleted successfully"
}
```

**Status:** `200 OK`

## Validation

The API validates `POST` and `PUT` requests.

The following fields are required:

* `title`
* `genre`
* `platform`
* `release_year`

If a required field is missing, the API returns:

```json
{
  "error": "genre is required"
}
```

**Status:** `400 Bad Request`

The frontend also uses HTML form validation to prevent empty fields from being submitted normally.

## Frontend

The frontend communicates with the Flask API using JavaScript's `fetch()` function.

The frontend supports:

### View

Users can click **VIEW** to retrieve a specific game from:

```text
GET /games/<id>
```

### Add

Users can enter game information and click **ADD GAME**.

The frontend sends:

```text
POST /games
```

### Edit

Users can click **EDIT** to open an edit form containing the game's current information.

The updated information is sent using:

```text
PUT /games/<id>
```

### Delete

Users can click **DELETE** and confirm the deletion.

The frontend sends:

```text
DELETE /games/<id>
```

### Search

Users can search for games by title using the search bar.

## How to Run

### 1. Install Python dependencies

Open a terminal in the project folder and run:

```bash
pip install -r requirements.txt
```

### 2. Start the Flask API

Run:

```bash
python app.py
```

The backend will run at:

```text
http://127.0.0.1:5000
```

### 3. Start the Frontend

Open a **second terminal** in the project folder and run:

```bash
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

The frontend will communicate with the Flask API running on port `5000`.

## Project Structure

```text
Frontend-API-Server/
│
├── app.py
├── games.db
├── requirements.txt
├── README.md
│
├── index.html
├── style.css
└── script.js
```

## Sample Games

The database initially contains 15 games:

1. Warframe
2. Tekken 8
3. V Rising
4. Elden Ring
5. Sekiro: Shadows Die Twice
6. Bloodborne
7. Unrailed!
8. Dead Cells
9. Skyrim
10. Sifu
11. Clair Obscur: Expedition 33
12. Baldur's Gate 3
13. Papers, Please
14. Cyberpunk 2077
15. Octopath Traveler

Additional games can be added through the frontend.

## Status Codes

| Status Code       | Meaning                         |
| ----------------- | ------------------------------- |
| `200 OK`          | Request completed successfully  |
| `201 Created`     | New game successfully created   |
| `400 Bad Request` | Required information is missing |
| `404 Not Found`   | Requested game does not exist   |

## Testing

The backend API was tested using HTTP requests for:

* GET
* POST
* PUT
* DELETE

The frontend was tested by performing the same CRUD operations through the user interface, including a deliberate validation error.
