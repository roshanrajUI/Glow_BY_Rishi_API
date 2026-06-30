CREATE DATABASE glow_by_rishi;
USE glow_by_rishi;

-- users
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
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

insert into service_category (category_name, description) values
    ('Hair Styles', 'hair style'),
    ('Saree Dropping', 'saree dropping'),
    ('Makeup', 'Makeup looks'),
    ('Combo', 'combo packages'),
    ('Threading', 'threading'),
    ('D-Tan', 'd-tan'),
    ('Bleach', 'bleach'),
    ('Waxing', 'waxing'),
    ('Hair Cuttings', 'hair cuttings'),
    ('Mehandi', 'mehandi');

-- services
CREATE TABLE services (
    service_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    service_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    category_id VARCHAR(36),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 
    FOREIGN KEY (category_id) references service_category(category_id)
);

INSERT INTO services (
    service_name,
    price,
    description,
    category_id
)
VALUES
('Basic', 5000.00, 'Professional bridal makeup service', 'c8d91285-6a5e-11f1-851b-4ccf7c621116'),
('Engagement Makeup', 3500.00, 'Professional makeup service for engagement ceremonies', 'c8d91285-6a5e-11f1-851b-4ccf7c621116'),
('Party Makeup', 2500.00, 'Makeup for parties and special events', 'c8d91285-6a5e-11f1-851b-4ccf7c621116'),
('Hair Styling', 1500.00, 'Hair styling and grooming', 'c8d8ff31-6a5e-11f1-851b-4ccf7c621116'),
('Basic', 800.00, 'Elegant saree draping for all occasions', 'c8d90e75-6a5e-11f1-851b-4ccf7c621116'),
('Facial', 150.00, 'Skin cleansing and facial treatment', 'c8d91821-6a5e-11f1-851b-4ccf7c621116'),
('Manicure', 700.00, 'Hand care treatment including nail shaping and polishing', 'c8d91821-6a5e-11f1-851b-4ccf7c621116'),
('Upper lip', 900.00, 'Foot care treatment including exfoliation and nail care', 'c8d9199a-6a5e-11f1-851b-4ccf7c621116'),
('Mehendi Arabic', 2000.00, 'Traditional and bridal mehendi designs', 'fe9d0868-6b31-11f1-851b-4ccf7c621116');


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
    email VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- bookings
CREATE TABLE bookings (
    booking_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    client_id CHAR(36) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    location VARCHAR(255),
    total_price DECIMAL(10,2) DEFAULT 0,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    notes TEXT,
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
    assigned_user_id CHAR(36) NOT NULL,
    service_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (assigned_user_id) REFERENCES users(user_id)
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

INSERT INTO work_portfolio (
    service_id,
    user_id,
    title,
    description,
    image_url,
    work_date
)
VALUES
(
    '2d3fbe79-6b33-11f1-851b-4ccf7c621116',
    '081ac1f7-6035-11f1-851b-4ccf7c621116',
    'Traditional Bridal Makeup',
    'Elegant South Indian bridal makeup with flawless finish.',
    'https://example.com/images/bridal-makeup.jpg',
    '2026-05-10'
),
(
    '2d3fb9fb-6b33-11f1-851b-4ccf7c621116',
    '081ac1f7-6035-11f1-851b-4ccf7c621116',
    'Engagement Glam Look',
    'Soft glam makeup for engagement ceremony.',
    'https://example.com/images/engagement-makeup.jpg',
    '2026-05-15'
),
(
    '2d3fbe79-6b33-11f1-851b-4ccf7c621116',
    '081ac1f7-6035-11f1-851b-4ccf7c621116',
    'Party Makeup Look',
    'Party makeup with bold eyes and nude lips.',
    'https://example.com/images/party-makeup.jpg',
    '2026-05-20'
),
(
    '2d3fc071-6b33-11f1-851b-4ccf7c621116',
    '081ac1f7-6035-11f1-851b-4ccf7c621116',
    'Elegant Hair Styling',
    'Modern hairstyle for wedding reception.',
    'https://example.com/images/hair-styling.jpg',
    '2026-05-22'
);