-- Seed 11 Suites with Exactly 20 Beds Total
-- Distribution: 6 Available (11 beds), 3 Occupied (5 beds), 2 Reserved (4 beds)

TRUNCATE TABLE bookings, rooms, users RESTART IDENTITY CASCADE;

-- Insert 11 Suites with 20 Beds
INSERT INTO rooms (room_number, room_type, bed_count, status) VALUES
('101', 'Single', 1, 'AVAILABLE'),
('102', 'Double', 2, 'OCCUPIED'),
('103', 'Deluxe', 2, 'AVAILABLE'),
('104', 'Executive', 2, 'RESERVED'),
('105', 'Suite', 3, 'AVAILABLE'),
('106', 'Single', 1, 'OCCUPIED'),
('201', 'Double', 2, 'AVAILABLE'),
('202', 'Deluxe', 2, 'OCCUPIED'),
('203', 'Executive', 2, 'AVAILABLE'),
('204', 'Double', 2, 'RESERVED'),
('205', 'Single', 1, 'AVAILABLE');

-- Insert Sample Seed Bookings
INSERT INTO bookings (room_id, guest_name, guest_email, guest_phone, check_in, check_out, status) VALUES
(2, 'Rahul Sharma', 'rahul.sharma@example.com', '+91 98765 43210', CURRENT_DATE, CURRENT_DATE + 3, 'CHECKED_IN'),
(4, 'Priya Patel', 'priya.patel@example.com', '+91 98765 43211', CURRENT_DATE + 1, CURRENT_DATE + 4, 'RESERVED'),
(6, 'Amit Verma', 'amit.verma@example.com', '+91 98765 43212', CURRENT_DATE, CURRENT_DATE + 2, 'CHECKED_IN'),
(8, 'Neha Gupta', 'neha.gupta@example.com', '+91 98765 43213', CURRENT_DATE, CURRENT_DATE + 5, 'CHECKED_IN'),
(10, 'Vikram Singh', 'vikram.singh@example.com', '+91 98765 43214', CURRENT_DATE + 2, CURRENT_DATE + 6, 'RESERVED');
