create type smart.jwt as (
	role text,
	user_id integer,
	exp bigint
);	