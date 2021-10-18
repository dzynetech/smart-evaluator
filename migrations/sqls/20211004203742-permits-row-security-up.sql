
DROP POLICY select_permit ON smart.permits;
grant execute on function smart.can_view_permit(integer) to smart_user;

create policy select_permit on smart.permits for select to smart_user USING 
	(smart.can_view_permit(id)

);