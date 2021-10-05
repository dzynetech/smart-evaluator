alter table smart.sources disable row level security;
drop policy select_source on smart.sources;
drop FUNCTION smart.can_view_source(integer);