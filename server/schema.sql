-- PopCritic schema (Supabase Postgres)
-- Confirmed against server/{auth,user,movie,people} queries.
-- NATURAL JOIN safety: the only shared column names between joined tables are the join keys
-- (user_id, movie_id, people_id). Do not add columns named like other tables' columns.

CREATE TABLE IF NOT EXISTS Users (
  user_id      TEXT PRIMARY KEY,        -- Google subject id
  join_date    TIMESTAMP DEFAULT current_timestamp,
  authenticity INTEGER DEFAULT 0,
  name         TEXT,
  email        TEXT,
  pic          TEXT
);

CREATE TABLE IF NOT EXISTS Sessions (
  session_id TEXT PRIMARY KEY,          -- crypto random token, sent as "token" header
  user_id    TEXT REFERENCES Users(user_id),
  created    TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS Movie (
  movie_id     TEXT PRIMARY KEY,        -- TMDb id
  title        TEXT,
  plot         TEXT,
  poster       TEXT,                    -- poster_path
  release_date TEXT,
  imdb_id      TEXT
);

CREATE TABLE IF NOT EXISTS People (
  people_id  TEXT PRIMARY KEY,          -- TMDb person id
  name       TEXT,
  image      TEXT,                      -- profile_path
  profession TEXT                       -- known_for_department
);

CREATE TABLE IF NOT EXISTS Casting (
  role      TEXT,
  people_id TEXT REFERENCES People(people_id),
  movie_id  TEXT REFERENCES Movie(movie_id),
  UNIQUE (people_id, movie_id, role)
);

CREATE TABLE IF NOT EXISTS Reviews (    -- polymorphic: exactly one of movie_id/people_id set
  review_id   SERIAL PRIMARY KEY,
  review_text TEXT,
  rating      INTEGER,
  user_id     TEXT REFERENCES Users(user_id),
  movie_id    TEXT REFERENCES Movie(movie_id),
  people_id   TEXT REFERENCES People(people_id),
  UNIQUE (user_id, movie_id),
  UNIQUE (user_id, people_id)
);
