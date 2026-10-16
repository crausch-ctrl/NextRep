CREATE TABLE IF NOT EXISTS users(
    id Integer PRIMARY KEY AUTOINCREMENT, 
    first_name TEXT NOT NULL, 
    last_name TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE, 
     password_hash TEXT NOT NULL , 
     role TEXT NOT NULL CHECK(play_role IN ('player', 'coach')),  c
     reated_at DATETIME DEFAULT CURRENT_TIMESTAMP
     );

CREATE TABLE IF NOT EXISTS player_profiles(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    jersey_number INTEGER,
    position TEXT, 
    weight NUMERIC,
    height NUMERIC,
    class_year TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);