CREATE DATABASE IF NOT EXISTS booklist;
USE booklist;

CREATE TABLE IF NOT EXISTS authors
(
    id         INT AUTO_INCREMENT,

    full_name  VARCHAR(255) NOT NULL,
    born_at    DATE         NOT NULL,
    died_at    DATE         NULL,
    info       TEXT(3000)   NOT NULL,
    image_file VARCHAR(255) NULL,
    created_at DATETIME     NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (full_name),
    UNIQUE (image_file)
);

CREATE TABLE IF NOT EXISTS books
(
    id          INT AUTO_INCREMENT,

    author_id   INT          NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT(2000)   NOT NULL,
    image_file  VARCHAR(255) NULL,
    book_file   VARCHAR(255) NULL,
    created_at  DATETIME     NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (author_id) REFERENCES authors (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    UNIQUE (book_file),
    UNIQUE (image_file)
);

CREATE TABLE IF NOT EXISTS genres
(
    id   INT AUTO_INCREMENT,

    name VARCHAR(255) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS statuses
(
    id   INT AUTO_INCREMENT,

    name VARCHAR(255) NOT NULL,

    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS books_genres
(
    book_id  INT,
    genre_id INT,

    PRIMARY KEY (book_id, genre_id),
    FOREIGN KEY (book_id) REFERENCES books (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS roles
(
    id   INT AUTO_INCREMENT,

    name VARCHAR(255) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS users
(
    id         INT AUTO_INCREMENT,
    role_id    INT,

    username   VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at DATETIME     NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles (id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE,
    UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS booklist
(
    user_id   INT NOT NULL,
    book_id   INT NOT NULL,
    status_id INT NOT NULL,

    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (status_id) REFERENCES statuses (id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews
(
    user_id    INT,
    book_id    INT,

    score      INT        NOT NULL,
    comment    TEXT(3000) NULL,
    created_at DATETIME   NOT NULL,

    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id, book_id) REFERENCES booklist(user_id, book_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
