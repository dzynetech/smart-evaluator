alter table smart.user add column annotator boolean default false;

CREATE FUNCTION smart.is_annotator() RETURNS boolean AS $$
begin
	return (select annotator from smart.user where id=(current_setting('jwt.claims.user_id',true))::integer);
end
$$ LANGUAGE plpgsql STABLE security definer;

create policy select_permit on smart.permits for select to smart_user USING (true);
create policy update_permit on smart.permits for update to smart_user USING 
(smart.is_annotator() );


grant execute on function smart.is_annotator() to smart_user;/* Replace with your SQL commands */