-- D1 (SQLite) schema for Glow By Rishi API
-- Ported from mysql.sql. UUID primary keys are generated in application code
-- (crypto.randomUUID()) since SQLite has no UUID() function. Booleans are
-- stored as INTEGER (0/1). Enums are stored as TEXT with a CHECK constraint.

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS otp;
DROP TABLE IF EXISTS booking_services;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS work_portfolio;
DROP TABLE IF EXISTS user_services;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS service_category;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL,
    gmail TEXT UNIQUE NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Beautician' CHECK (role IN ('Admin', 'Beautician')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE service_category (
    category_id TEXT PRIMARY KEY,
    category_name TEXT UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE services (
    service_id TEXT PRIMARY KEY,
    service_name TEXT NOT NULL,
    price REAL NOT NULL DEFAULT 0,
    description TEXT,
    category_id TEXT,
    image_url TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES service_category(category_id)
);

CREATE TABLE user_services (
    user_service_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

CREATE TABLE clients (
    client_id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE,
    gmail TEXT,
    address TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE bookings (
    booking_id TEXT PRIMARY KEY,
    booking_number TEXT UNIQUE NOT NULL,
    client_id TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    booking_time TEXT NOT NULL,
    location TEXT,
    total_price REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'OTP Pending' CHECK (status IN ('OTP Pending', 'Pending', 'Confirmed', 'Completed', 'Cancelled')),
    notes TEXT,
    is_otp_verified INTEGER NOT NULL DEFAULT 0,
    review_rating INTEGER,
    review_text TEXT,
    review_date TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE booking_services (
    booking_service_id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    price REAL NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

CREATE TABLE work_portfolio (
    work_id TEXT PRIMARY KEY,
    service_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    work_date TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE otp (
    id TEXT PRIMARY KEY,
    booking_number TEXT UNIQUE NOT NULL,
    gmail TEXT,
    otp_hash TEXT,
    expires_at TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_booking_services_booking_id ON booking_services(booking_id);
CREATE INDEX idx_work_portfolio_service_id ON work_portfolio(service_id);
