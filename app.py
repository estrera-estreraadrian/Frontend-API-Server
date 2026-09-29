from flask import Flask, request
from flask_cors import CORS
import sqlite3
import os
app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect("games.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            genre TEXT NOT NULL,
            platform TEXT NOT NULL,
            release_year INTEGER NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def seed_games():
    conn = sqlite3.connect("games.db")
    cursor = conn.cursor()

    games = [
        ("Warframe", "Action RPG", "PC", 2013),
        ("Tekken 8", "Fighting", "PC", 2024),
        ("V Rising", "Survival RPG", "PC", 2024),
        ("Elden Ring", "Action RPG", "PC", 2022),
        ("Sekiro: Shadows Die Twice", "Action Adventure", "PC", 2019),
        ("Bloodborne", "Action RPG", "PS4", 2015),
        ("Unrailed!", "Co-op / Strategy", "PC", 2019),
        ("Dead Cells", "Roguelike", "PC", 2018),
        ("Skyrim", "Action RPG", "PC", 2011),
        ("Sifu", "Beat 'em up", "PC", 2022),
        ("Clair Obscur: Expedition 33", "RPG", "PC", 2025),
        ("Baldur's Gate 3", "RPG", "PC", 2023),
        ("Papers, Please", "Simulation", "PC", 2013),
        ("Cyberpunk 2077", "Action RPG", "PC", 2020),
        ("Octopath Traveler", "RPG", "PC", 2018)
    ]

    cursor.execute("SELECT COUNT(*) FROM games")
    count = cursor.fetchone()[0]

    if count == 0:
        cursor.executemany("""
            INSERT INTO games (title, genre, platform, release_year)
            VALUES (?, ?, ?, ?)
        """, games)

    conn.commit()
    conn.close()

@app.route("/")
def home():
    return {"message": "Video Games REST API is running!"}, 200

@app.route("/games", methods=["GET"])
def get_games():
    conn = sqlite3.connect("games.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM games")
    games = cursor.fetchall()

    conn.close()

    return [dict(game) for game in games], 200


@app.route("/games/<int:game_id>", methods=["GET"])
def get_game(game_id):
    conn = sqlite3.connect("games.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM games WHERE id = ?", (game_id,))
    game = cursor.fetchone()

    conn.close()

    if game is None:
        return {"error": "Game not found"}, 404

    return dict(game), 200


@app.route("/games", methods=["POST"])
def create_game():
    data = request.get_json()

    if not data:
        return {"error": "Request body is required"}, 400

    required_fields = ["title", "genre", "platform", "release_year"]

    for field in required_fields:
        if field not in data or data[field] in ("", None):
            return {"error": f"{field} is required"}, 400

    conn = sqlite3.connect("games.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO games (title, genre, platform, release_year)
        VALUES (?, ?, ?, ?)
    """, (
        data["title"],
        data["genre"],
        data["platform"],
        data["release_year"]
    ))

    conn.commit()

    game_id = cursor.lastrowid

    conn.close()

    return {
        "id": game_id,
        "title": data["title"],
        "genre": data["genre"],
        "platform": data["platform"],
        "release_year": data["release_year"]
    }, 201


@app.route("/games/<int:game_id>", methods=["PUT"])
def update_game(game_id):
    data = request.get_json()

    if not data:
        return {"error": "Request body is required"}, 400

    required_fields = ["title", "genre", "platform", "release_year"]

    for field in required_fields:
        if field not in data or data[field] in ("", None):
            return {"error": f"{field} is required"}, 400

    conn = sqlite3.connect("games.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM games WHERE id = ?", (game_id,))
    game = cursor.fetchone()

    if game is None:
        conn.close()
        return {"error": "Game not found"}, 404

    cursor.execute("""
        UPDATE games
        SET title = ?, genre = ?, platform = ?, release_year = ?
        WHERE id = ?
    """, (
        data["title"],
        data["genre"],
        data["platform"],
        data["release_year"],
        game_id
    ))

    conn.commit()

    cursor.execute("SELECT * FROM games WHERE id = ?", (game_id,))
    updated_game = cursor.fetchone()

    conn.close()

    return dict(updated_game), 200

@app.route("/games/<int:game_id>", methods=["DELETE"])
def delete_game(game_id):
    conn = sqlite3.connect("games.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM games WHERE id = ?", (game_id,))
    game = cursor.fetchone()

    if game is None:
        conn.close()
        return {"error": "Game not found"}, 404

    cursor.execute("DELETE FROM games WHERE id = ?", (game_id,))
    conn.commit()
    conn.close()

    return {"message": "Game deleted successfully"}, 200


if __name__ == "__main__":
    init_db()
    seed_games()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))