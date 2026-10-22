/* 
 this file contains the SQL schema for the database, */

/* this is the table that holds the user infromation*/
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    first_name TEXT NOT NULL, 
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE, 
    password_hash TEXT NOT NULL , 
    is_active BOOLEAN NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)), 
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
/* this is the table that connects a user to a team.*/
CREATE TABLE IF NOT EXISTS team_memberships(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    UNIQUE(user_id, team_id)
);
/* This table stores the different performance metrics that NextRep tracks. */
CREATE TABLE IF NOT EXISTS metrics(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    unit TEXT NOT NULL,
    better_direction TEXT NOT NULL CHECK(better_direction IN ('higher', 'lower')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
/* This table stores player performance results. */
CREATE TABLE IF NOT EXISTS performance_results(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    metric_id INTEGER NOT NULL,
    value NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')),
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES users(id),
    FOREIGN KEY (metric_id) REFERENCES metrics(id)
);
/* this table stores the players goals. */
CREATE TABLE IF NOT EXISTS goals(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    metric_id INTEGER NOT NULL,
    target_value NUMERIC NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES users(id),
    FOREIGN KEY (metric_id) REFERENCES metrics(id)
);
CREATE TABLE IF NOT EXISTS invitations(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL, 
    email TEXT NOT NULL,
    invited_by INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL, 
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (invited_by) REFERENCES users(id)
);