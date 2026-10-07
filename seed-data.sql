-- Seed data for local development (wrangler d1 execute --local)
INSERT INTO users (user_id, user_name, gmail, phone_number, password, role, is_active, created_at, updated_at)
VALUES (
    lower(hex(randomblob(16))),
    'Rishitha',
    'dummy@gmail.com',
    '7675997701',
    'dummy',
    'Beautician',
    1,
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
);
