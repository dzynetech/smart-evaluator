/* Replace with your SQL commands */
UPDATE smart.permits SET notes= '' WHERE notes IS NULL;
ALTER TABLE smart.permits ALTER COLUMN notes SET NOT NULL;