const schema = `
-- Table: hr
CREATE TABLE hr (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    state VARCHAR(100),
    zipcode VARCHAR(20),
    city VARCHAR(100),
    isverified BOOLEAN DEFAULT FALSE
);

-- Table: manager
CREATE TABLE manager (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    state VARCHAR(100),
    zipcode VARCHAR(20),
    city VARCHAR(100),
    isverified BOOLEAN DEFAULT FALSE
);

-- Table: staff
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    state VARCHAR(100),
    zipcode VARCHAR(20),
    city VARCHAR(100),
    isverified BOOLEAN DEFAULT FALSE
);

-- Table: managerrole
CREATE TABLE managerrole (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES manager(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    pay NUMERIC(10,2),
    role VARCHAR(50),
    position VARCHAR(100)
);

-- Table: staffrole
CREATE TABLE staffrole (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    pay NUMERIC(10,2),
    role VARCHAR(50),
    position VARCHAR(100)
);

-- Table: shifts
CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

-- Table: leave
CREATE TABLE leave (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    totalleave INTEGER DEFAULT 40,
    leavestart DATE NOT NULL,
    leaveend DATE NOT NULL,
    days_requested INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL
);
`;

module.exports = schema;