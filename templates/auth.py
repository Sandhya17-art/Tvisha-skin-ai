import sqlite3

from werkzeug.security import check_password_hash, generate_password_hash

DB_PATH = "users.db"


def get_connection():
    return sqlite3.connect(DB_PATH)


def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def create_user(username, password):
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (username, generate_password_hash(password)),
        )
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()


def verify_user(username, password):
    conn = get_connection()
    row = conn.execute(
        "SELECT id, username, password_hash FROM users WHERE username = ?", (username,)
    ).fetchone()
    conn.close()
    if row is None:
        return None
    user_id, db_username, password_hash = row
    if check_password_hash(password_hash, password):
        return {"id": user_id, "username": db_username}
    return None
