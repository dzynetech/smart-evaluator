alter table smart.sources enable row level security;

CREATE FUNCTION smart.can_view_source(source_idx integer) RETURNS boolean AS $$
DECLARE
	result boolean;
begin
	return (select count(*)::int::bool from smart.users_sources where 
		source_id=source_idx and 
		user_id=(current_setting('jwt.claims.user_id',true))::integer);
end
$$ LANGUAGE plpgsql STABLE security definer;
grant execute on function smart.can_view_source(integer) to smart_user;

create policy select_source on smart.sources for select to smart_user USING 
	(smart.can_view_source(id));