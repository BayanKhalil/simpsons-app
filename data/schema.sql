CREATE TABLE IF NOT EXISTS mycollection 
(
    id SERIAL NOT NULL,
    character VARCHAR(250) NOT NULL,
    quote VARCHAR(250) NOT NULL,
    image TEXT NOT NULL,
    characterDirection VARCHAR(250) NOT NULL
);