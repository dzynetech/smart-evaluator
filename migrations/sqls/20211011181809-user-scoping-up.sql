comment on table smart.user is '@omit';
comment on function smart.can_view_permit is '@omit';
comment on function smart.can_view_source is '@omit';

alter function smart."register_user" set schema "smart_private"