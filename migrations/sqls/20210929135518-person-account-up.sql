
create table smart.user (
	id serial PRIMARY key,
	username text not NULL,
	created_at TIMESTAMPTZ DEFAULT now()
);

comment on column smart.user.created_at IS '@omit update,delete';

create table smart_private.user_account (
	user_id integer PRIMARY KEY REFERENCES  smart.user (id) ON DELETE CASCADE,
	password_hash text NOT NULL
);
