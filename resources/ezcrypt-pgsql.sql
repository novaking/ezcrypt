
CREATE TABLE pastes (
    id BIGSERIAL PRIMARY KEY,
    password character varying(100),
    data text NOT NULL,
    syntax character varying(40) NOT NULL,
    crypto character varying(20) NOT NULL,
    added integer NOT NULL,
    ttl integer NOT NULL
);
