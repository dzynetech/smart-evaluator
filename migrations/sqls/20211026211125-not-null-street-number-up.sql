/* Replace with your SQL commands */
UPDATE smart.permits SET street_number= '' WHERE street_number IS NULL;
ALTER TABLE smart.permits ALTER COLUMN street_number SET NOT NULL;