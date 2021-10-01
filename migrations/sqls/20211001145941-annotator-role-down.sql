alter table smart.user drop column annotator;
alter table smart.permits disable row level security;

drop policy update_permit on smart.permits;
drop policy select_permit on smart.permits;
drop FUNCTION smart.is_annotator() ;

