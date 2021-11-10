CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    photo VARCHAR(255),
    login VARCHAR(255),
    password VARCHAR(255),
    role_id VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE);

CREATE INDEX first_name_index ON users(first_name);

CREATE INDEX last_name_index ON users(last_name);

CREATE INDEX login_index ON users(login);