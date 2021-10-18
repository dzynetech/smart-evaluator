DROP POLICY select_permit ON smart.permits;
create policy select_permit on smart.permits for select to smart_user USING (true);