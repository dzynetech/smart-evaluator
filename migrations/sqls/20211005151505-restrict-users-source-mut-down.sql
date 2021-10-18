alter table "smart_private".users_sources set schema smart;
drop policy select_source on smart.sources;
drop policy select_permit on smart.permits;
drop function smart."can_view_permit";
drop function smart."can_view_source";

DROP FUNCTION IF EXISTS can_view_permit;
CREATE OR REPLACE FUNCTION smart.can_view_permit(permit_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
	this_source integer;
	result boolean;
begin
	select source_id into this_source from smart.permits where id=permit_id;
	return (select count(*)::int::bool from smart.users_sources where 
		source_id=this_source and 
		user_id=(current_setting('jwt.claims.user_id',true))::integer);
	return result;
end
$function$

DROP FUNCTION IF EXISTS can_view_source;
CREATE OR REPLACE FUNCTION smart.can_view_source(source_idx integer)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
	result boolean;
begin
	return (select count(*)::int::bool from smart.users_sources where 
		source_id=source_idx and 
		user_id=(current_setting('jwt.claims.user_id',true))::integer);
end
$function$

grant execute on function smart.can_view_source(integer) to smart_user;
grant execute on function smart.can_view_permit(integer) to smart_user;

create policy select_permit on smart.permits for select to smart_user USING 
	(smart.can_view_permit(id)
);

create policy select_source on smart.sources for select to smart_user USING 
	(smart.can_view_source(id)
);
