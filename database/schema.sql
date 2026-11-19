/*
  NextRep PostgreSQL Database Schema
*/


CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    role TEXT NOT NULL
        CHECK (role IN ('player', 'coach')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS player_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    jersey_number INTEGER,
    position TEXT,
    weight NUMERIC,
    height NUMERIC,
    class_year TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sport TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS team_memberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE,

    UNIQUE(user_id, team_id)
);


CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    unit TEXT NOT NULL,

    better_direction TEXT NOT NULL
        CHECK (
            better_direction IN (
                'higher',
                'lower'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS performance_results (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL,
    metric_id INTEGER NOT NULL,
    value NUMERIC NOT NULL,

    status TEXT NOT NULL
        CHECK (
            status IN (
                'pending',
                'approved',
                'rejected'
            )
        ),

    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (player_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (metric_id)
        REFERENCES metrics(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL,
    metric_id INTEGER NOT NULL,
    target_value NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (player_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (metric_id)
        REFERENCES metrics(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS invitations (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    invited_by INTEGER NOT NULL,

    status TEXT NOT NULL
        CHECK (
            status IN (
                'pending',
                'accepted',
                'declined',
                'expired'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,

    FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE,

    FOREIGN KEY (invited_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);