-- Seed data for payment_methods
INSERT INTO payment_methods (type, name, value, is_active) VALUES
('UPI', 'Google Pay UPI', 'your_upi_id@okaxis', TRUE),
('UPI', 'PhonePe UPI', 'your_phonepe_id@ybl', TRUE),
('QR_CODE', 'Paytm QR Code', 'https://example.com/your_paytm_qr.png', TRUE), -- Replace with actual QR image URL
('BANK_TRANSFER', 'Bank Account Transfer', 'Account Name: EduWanders, Account No: 1234567890, IFSC: ABCD0001234', TRUE);
