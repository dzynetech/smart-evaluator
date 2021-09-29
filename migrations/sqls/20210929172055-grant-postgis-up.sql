grant usage on schema public to smart_user;
revoke all PRIVILEGES on table public.migrations from smart_user;
revoke all PRIVILEGES on table public.migrations_state from smart_user;