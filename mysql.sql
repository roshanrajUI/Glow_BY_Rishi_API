CREATE DATABASE glow_by_rishi;
USE glow_by_rishi;

-- users
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_name VARCHAR(50) NOT NULL,
    gmail VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(10) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Beautician') DEFAULT 'Beautician',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- service category
CREATE TABLE service_category (
    category_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category_name VARCHAR(50) UNIQUE NOT NULL,
    description Text,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- services
CREATE TABLE services (
    service_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    service_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    category_id VARCHAR(36),
    image_url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 
    FOREIGN KEY (category_id) references service_category(category_id)
);

-- user_services
CREATE TABLE user_services (
    user_service_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    service_id CHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- clients
CREATE TABLE clients (
    client_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    client_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    gmail VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- bookings
CREATE TABLE bookings (
    booking_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_number CHAR(8) UNIQUE NOT NULL,
    client_id CHAR(36) NOT NULL,
    booking_date DATETIME NOT NULL,
    booking_time DATETIME NOT NULL,
    location VARCHAR(255),
    total_price DECIMAL(10,2) DEFAULT 0,
    status ENUM('OTP Pending', 'Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'OTP Pending',
    notes TEXT,
    isOtpVerified BOOLEAN DEFAULT FALSE,
    review_rating TINYINT,
    review_text TEXT,
    review_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- booking_services
CREATE TABLE booking_services (
    booking_service_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id CHAR(36) NOT NULL,
    service_id CHAR(36) NOT NULL,
    -- assigned_user_id CHAR(36) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
    -- FOREIGN KEY (assigned_user_id) REFERENCES users(user_id)
);

-- work_portfolio
CREATE TABLE work_portfolio (
    work_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    service_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    work_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- otp
create table otp(
    otp_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_number CHAR(8) UNIQUE NOT NULL,
    gmail VARCHAR(255),
    otp_hash varchar(255),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);