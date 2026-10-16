/* 
 this file contains the SQL schema for the database, */

/* this is the table that holds the user infromation*/*
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    first_name TEXT NOT NULL, 
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE, 
    password_hash TEXT NOT NULL , 
    role TEXT NOT NULL CHECK(role IN ('player', 'coach')),  
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
     );
/* this is the table that shows the player prolfies*/
CREATE TABLE IF NOT EXISTS player_profiles(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    jersey_number INTEGER,
    position TEXT, 
    weight NUMERIC,
    height NUMERIC,
    class_year TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

/* this is the table that holds the team information.*/
CREATE TABLE IF NOT EXISTS teams(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    sport TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams_Memberships(


);