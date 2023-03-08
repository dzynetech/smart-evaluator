--
-- Smart schema with OWNER "postgres"
--

-- Dumped from database version 13.3 (Debian 13.3-1.pgdg100+1)
-- Dumped by pg_dump version 13.2 (Debian 13.2-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE ROLE smart_user;
CREATE ROLE smart_anonymous;

--
-- Name: postgraphile_watch; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA postgraphile_watch;


ALTER SCHEMA postgraphile_watch OWNER TO "postgres";

--
-- Name: smart; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA smart;


    ALTER SCHEMA smart OWNER TO "postgres";

--
-- Name: smart_private; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA smart_private;


ALTER SCHEMA smart_private OWNER TO "postgres";

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: classification; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.classification AS ENUM (
    'unclassified',
    'construction',
    'not_construction',
    'possible_construction',
    'duplicate'
);


ALTER TYPE public.classification OWNER TO "postgres";

--
-- Name: jwt; Type: TYPE; Schema: smart; Owner: postgres
--

CREATE TYPE smart.jwt AS (
	role text,
	user_id integer,
	exp bigint
);


ALTER TYPE smart.jwt OWNER TO "postgres";

--
-- Name: notify_watchers_ddl(); Type: FUNCTION; Schema: postgraphile_watch; Owner: postgres
--

CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;


ALTER FUNCTION postgraphile_watch.notify_watchers_ddl() OWNER TO "postgres";

--
-- Name: notify_watchers_drop(); Type: FUNCTION; Schema: postgraphile_watch; Owner: postgres
--

CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;


ALTER FUNCTION postgraphile_watch.notify_watchers_drop() OWNER TO "postgres";

--
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.trigger_set_timestamp() OWNER TO "postgres";

--
-- Name: authenticate(text, text); Type: FUNCTION; Schema: smart; Owner: postgres
--

CREATE FUNCTION smart.authenticate(username text, password text) RETURNS smart.jwt
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $$
declare
	account smart_private.user_account;
	u_id int;
BEGIN
  SELECT id into u_id from smart.user 
  where smart.user.username = authenticate.username;
  SELECT * into account from smart_private.user_account
  where user_account.user_id = u_id; 
  
  if account.password_hash = crypt(password,account.password_hash) THEN
	RETURN ('smart_user',account.user_id,
	extract(epoch from (now() + interval '30 days'))
	)::smart.jwt;
  else
   return NULL;
  END if;
END;
$$;


ALTER FUNCTION smart.authenticate(username text, password text) OWNER TO "postgres";

--
-- Name: can_view_permit(integer); Type: FUNCTION; Schema: smart; Owner: postgres
--

CREATE FUNCTION smart.can_view_permit(permit_id integer) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
DECLARE
	this_source integer;
	result boolean;
begin
	select source_id into this_source from smart.permits where id=permit_id;
	return (select count(*)::int::bool from smart_private.users_sources where 
		source_id=this_source and 
		user_id=(current_setting('jwt.claims.user_id',true))::integer);
	return result;
end
$$;


ALTER FUNCTION smart.can_view_permit(permit_id integer) OWNER TO "postgres";

--
-- Name: FUNCTION can_view_permit(permit_id integer); Type: COMMENT; Schema: smart; Owner: postgres
--

COMMENT ON FUNCTION smart.can_view_permit(permit_id integer) IS '@omit';


--
-- Name: can_view_source(integer); Type: FUNCTION; Schema: smart; Owner: postgres
--

CREATE FUNCTION smart.can_view_source(source_idx integer) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
DECLARE
	result boolean;
begin
	return (select count(*)::int::bool from smart_private.users_sources where 
		source_id=source_idx and 
		user_id=(current_setting('jwt.claims.user_id',true))::integer);
end
$$;


ALTER FUNCTION smart.can_view_source(source_idx integer) OWNER TO "postgres";

--
-- Name: FUNCTION can_view_source(source_idx integer); Type: COMMENT; Schema: smart; Owner: postgres
--

COMMENT ON FUNCTION smart.can_view_source(source_idx integer) IS '@omit';


--
-- Name: change_password(text); Type: FUNCTION; Schema: smart; Owner: postgres
--

CREATE FUNCTION smart.change_password(password text) RETURNS void
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $$
BEGIN
	IF length(password) < 8 THEN
		RAISE EXCEPTION 'password is too short';
	END IF;
	PERFORM smart_private.change_user_password(current_setting('jwt.claims.user_id',true)::integer,password);
end;
$$;


ALTER FUNCTION smart.change_password(password text) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: user; Type: TABLE; Schema: smart; Owner: postgres
--

CREATE TABLE smart."user" (
    id integer NOT NULL,
    username text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    annotator boolean DEFAULT false,
    urbanscape boolean DEFAULT false
);


ALTER TABLE smart."user" OWNER TO "postgres";

--
-- Name: TABLE "user"; Type: COMMENT; Schema: smart; Owner: postgres
--

COMMENT ON TABLE smart."user" IS '@omit';


--
-- Name: COLUMN "user".created_at; Type: COMMENT; Schema: smart; Owner: postgres
--

COMMENT ON COLUMN smart."user".created_at IS '@omit update,delete';


--
-- Name: current_user(); Type: FUNCTION; Schema: smart; Owner: postgres
--

CREATE FUNCTION smart."current_user"() RETURNS smart."user"
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
declare
	curr_user_id integer;
	u smart.user;
begin
	curr_user_id = (nullif ((current_setting('jwt.claims.user_id',true)),'')::integer);
	select * into u from smart.user where id=curr_user_id;
	return u;
end;
$$;


ALTER FUNCTION smart."current_user"() OWNER TO "postgres";

--
-- Name: is_annotator(); Type: FUNCTION; Schema: smart; Owner: postgres
--

CREATE FUNCTION smart.is_annotator() RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
begin
	return (select annotator from smart.user where id=(current_setting('jwt.claims.user_id',true))::integer);
end
$$;


ALTER FUNCTION smart.is_annotator() OWNER TO "postgres";

--
-- Name: change_user_password(integer, text); Type: FUNCTION; Schema: smart_private; Owner: postgres
--

CREATE FUNCTION smart_private.change_user_password(uid integer, password text) RETURNS void
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $$
declare
BEGIN
	update smart_private.user_account set password_hash = public.crypt(password,public.gen_salt('bf'))
	where user_id = uid; 
end;
$$;


ALTER FUNCTION smart_private.change_user_password(uid integer, password text) OWNER TO "postgres";

--
-- Name: register_user(text, text); Type: FUNCTION; Schema: smart_private; Owner: postgres
--

CREATE FUNCTION smart_private.register_user(username text, password text) RETURNS smart."user"
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $$
declare
	new_user smart.user;
BEGIN
	insert into smart.user (username) values (username)
	returning * INTO new_user;
	insert into smart_private.user_account (user_id,password_hash)
	values (new_user.id, public.crypt(password,public.gen_salt('bf')));
return new_user;
end;
$$;


ALTER FUNCTION smart_private.register_user(username text, password text) OWNER TO "postgres";

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.migrations OWNER TO "postgres";

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO "postgres";

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: migrations_state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations_state (
    key character varying NOT NULL,
    value text NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.migrations_state OWNER TO "postgres";

--
-- Name: permits; Type: TABLE; Schema: smart; Owner: postgres
--

CREATE TABLE smart.permits (
    id integer NOT NULL,
    cost real NOT NULL,
    sqft real NOT NULL,
    street_number character varying(16) NOT NULL,
    street character varying(255),
    city character varying(255),
    state character varying(255),
    zip character varying(16),
    formatted_address character varying(255),
    location_accuracy real,
    source_id integer,
    import_id character varying(16) NOT NULL,
    classification public.classification DEFAULT 'unclassified'::public.classification NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    geocode_data text,
    location public.geometry(Point,4326),
    image_url character varying(255),
    moviegen boolean NOT NULL DEFAULT true,
    moviegen_retry integer NOT NULL DEFAULT 0,
    data jsonb,
    has_location boolean GENERATED ALWAYS AS ((location IS NOT NULL)) STORED,
    notes text NOT NULL,
    kml_url character varying(255),
    issue_date date,
    bounds public.geometry(MultiPolygon,4326),
    has_bounds boolean GENERATED ALWAYS AS ((bounds IS NOT NULL)) STORED,
    name character varying,
    permit_data jsonb,
    permit_data_text text GENERATED ALWAYS AS (permit_data) STORED
);


ALTER TABLE smart.permits OWNER TO "postgres";

--
-- Name: TABLE permits; Type: COMMENT; Schema: smart; Owner: postgres
--

COMMENT ON TABLE smart.permits IS '@omit create,delete
a construction permit';


--
-- Name: permits_id_seq; Type: SEQUENCE; Schema: smart; Owner: postgres
--

CREATE SEQUENCE smart.permits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE smart.permits_id_seq OWNER TO "postgres";

--
-- Name: permits_id_seq; Type: SEQUENCE OWNED BY; Schema: smart; Owner: postgres
--

ALTER SEQUENCE smart.permits_id_seq OWNED BY smart.permits.id;


--
-- Name: sources; Type: TABLE; Schema: smart; Owner: postgres
--

CREATE TABLE smart.sources (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    has_urbanscape_videos boolean DEFAULT false
);


ALTER TABLE smart.sources OWNER TO "postgres";

--
-- Name: TABLE sources; Type: COMMENT; Schema: smart; Owner: postgres
--

COMMENT ON TABLE smart.sources IS '@omit create,update,delete
The datasource permits were imported from';


--
-- Name: sources_id_seq; Type: SEQUENCE; Schema: smart; Owner: postgres
--

CREATE SEQUENCE smart.sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE smart.sources_id_seq OWNER TO "postgres";

--
-- Name: sources_id_seq; Type: SEQUENCE OWNED BY; Schema: smart; Owner: postgres
--

ALTER SEQUENCE smart.sources_id_seq OWNED BY smart.sources.id;


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: smart; Owner: postgres
--

CREATE SEQUENCE smart.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE smart.user_id_seq OWNER TO "postgres";

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: smart; Owner: postgres
--

ALTER SEQUENCE smart.user_id_seq OWNED BY smart."user".id;


--
-- Name: user_account; Type: TABLE; Schema: smart_private; Owner: postgres
--

CREATE TABLE smart_private.user_account (
    user_id integer NOT NULL,
    password_hash text NOT NULL
);


ALTER TABLE smart_private.user_account OWNER TO "postgres";

--
-- Name: users_sources; Type: TABLE; Schema: smart_private; Owner: postgres
--

CREATE TABLE smart_private.users_sources (
    user_id integer,
    source_id integer
);


ALTER TABLE smart_private.users_sources OWNER TO "postgres";

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: permits id; Type: DEFAULT; Schema: smart; Owner: postgres
--

ALTER TABLE ONLY smart.permits ALTER COLUMN id SET DEFAULT nextval('smart.permits_id_seq'::regclass);


--
-- Name: sources id; Type: DEFAULT; Schema: smart; Owner: postgres
--

ALTER TABLE ONLY smart.sources ALTER COLUMN id SET DEFAULT nextval('smart.sources_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: smart; Owner: postgres
--

ALTER TABLE ONLY smart."user" ALTER COLUMN id SET DEFAULT nextval('smart.user_id_seq'::regclass);


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, name, run_on) FROM stdin;
1	/20210928184328-create-schema	2021-10-18 15:40:01.819
2	/20210929133508-restrict-sources	2021-10-18 15:40:01.826
3	/20210929134338-restrict-permits	2021-10-18 15:40:01.829
4	/20210929135339-private-schema	2021-10-18 15:40:01.833
5	/20210929135518-person-account	2021-10-18 15:40:01.863
6	/20210929140522-register-user	2021-10-18 15:40:01.891
7	/20210929142141-create-roles	2021-10-18 15:40:01.896
8	/20210929142607-jwt	2021-10-18 15:40:01.902
9	/20210929142935-authenticate-function	2021-10-18 15:40:01.905
10	/20210929143536-grant-roles	2021-10-18 15:40:01.911
11	/20210929150642-restrict-user-table	2021-10-18 15:40:01.915
12	/20210929172055-grant-postgis	2021-10-18 15:40:01.918
13	/20210929183207-restrict-register-user	2021-10-18 15:40:01.921
14	/20211001145941-annotator-role	2021-10-18 15:40:01.928
15	/20211001201622-get-user-id	2021-10-18 15:40:01.932
16	/20211004185651-users-sources	2021-10-18 15:40:01.938
17	/20211004192413-permits-view	2021-10-18 15:40:01.941
18	/20211004203742-permits-row-security	2021-10-18 15:40:01.947
19	/20211005131812-permit-source-id-idx	2021-10-18 15:40:02.221
20	/20211005145203-row-restrict-sources	2021-10-18 15:40:02.226
21	/20211005150733-drop-users-sources-id	2021-10-18 15:40:02.231
22	/20211005151505-restrict-users-source-mut	2021-10-18 15:40:02.236
23	/20211005181419-unique-users-sources	2021-10-18 15:40:02.24
24	/20211007134956-source-urbanscape-vids	2021-10-18 15:40:02.245
25	/20211007171930-change-user-passwd	2021-10-18 15:40:02.248
26	/20211007180809-change-passwd-userspace	2021-10-18 15:40:02.252
27	/20211011171904-current-user	2021-10-18 15:40:02.255
28	/20211011175112-drop-get-user-id	2021-10-18 15:40:02.258
29	/20211011181809-user-scoping	2021-10-18 15:40:02.262
30	/20211015201924-user-urbanscape-perm	2021-10-18 15:40:02.266
31	/20211021153915-no-null-notes	2021-10-21 17:54:06.331
32	/20211026205748-generate-permit-data-text	2021-10-27 17:35:38.705
33	/20211026211125-not-null-street-number	2021-10-27 17:35:38.9
\.


--
-- Data for Name: migrations_state; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations_state (key, value, run_on) FROM stdin;
__dbmigrate_schema__	{}	2021-10-18 15:36:04.984
__dbmigrate_state__	{"s":{"step":0,"fin":0,"date":"2021-10-27T17:35:37.232Z"}}	2021-10-27 17:35:37.232
\.





SELECT pg_catalog.setval('public.migrations_id_seq', 33, true);


--
-- Name: permits_id_seq; Type: SEQUENCE SET; Schema: smart; Owner: postgres
--

SELECT pg_catalog.setval('smart.permits_id_seq', 146943, true);


--
-- Name: sources_id_seq; Type: SEQUENCE SET; Schema: smart; Owner: postgres
--

SELECT pg_catalog.setval('smart.sources_id_seq', 19, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: smart; Owner: postgres
--

SELECT pg_catalog.setval('smart.user_id_seq', 11, true);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: migrations_state migrations_state_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations_state
    ADD CONSTRAINT migrations_state_pkey PRIMARY KEY (key);


--
-- Name: permits permits_pkey; Type: CONSTRAINT; Schema: smart; Owner: postgres
--

ALTER TABLE ONLY smart.permits
    ADD CONSTRAINT permits_pkey PRIMARY KEY (id);


--
-- Name: sources sources_name_key; Type: CONSTRAINT; Schema: smart; Owner: postgres
--

ALTER TABLE ONLY smart.sources
    ADD CONSTRAINT sources_name_key UNIQUE (name);


--
-- Name: sources sources_pkey; Type: CONSTRAINT; Schema: smart; Owner: postgres
--

ALTER TABLE ONLY smart.sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: smart; Owner: postgres
--

ALTER TABLE ONLY smart."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: users_sources unique_rows; Type: CONSTRAINT; Schema: smart_private; Owner: postgres
--

ALTER TABLE ONLY smart_private.users_sources
    ADD CONSTRAINT unique_rows UNIQUE (user_id, source_id);


--
-- Name: user_account user_account_pkey; Type: CONSTRAINT; Schema: smart_private; Owner: postgres
--

ALTER TABLE ONLY smart_private.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (user_id);


--
-- Name: idx_source_id_permits; Type: INDEX; Schema: smart; Owner: postgres
--

CREATE INDEX idx_source_id_permits ON smart.permits USING btree (source_id);


--
-- Name: permits set_timestamp; Type: TRIGGER; Schema: smart; Owner: postgres
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON smart.permits FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: permits fk_source; Type: FK CONSTRAINT; Schema: smart; Owner: postgres
--

ALTER TABLE ONLY smart.permits
    ADD CONSTRAINT fk_source FOREIGN KEY (source_id) REFERENCES smart.sources(id);


--
-- Name: users_sources fk_source; Type: FK CONSTRAINT; Schema: smart_private; Owner: postgres
--

ALTER TABLE ONLY smart_private.users_sources
    ADD CONSTRAINT fk_source FOREIGN KEY (source_id) REFERENCES smart.sources(id);


--
-- Name: users_sources fk_user; Type: FK CONSTRAINT; Schema: smart_private; Owner: postgres
--

ALTER TABLE ONLY smart_private.users_sources
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES smart."user"(id);


--
-- Name: user_account user_account_user_id_fkey; Type: FK CONSTRAINT; Schema: smart_private; Owner: postgres
--

ALTER TABLE ONLY smart_private.user_account
    ADD CONSTRAINT user_account_user_id_fkey FOREIGN KEY (user_id) REFERENCES smart."user"(id) ON DELETE CASCADE;


--
-- Name: permits; Type: ROW SECURITY; Schema: smart; Owner: postgres
--

ALTER TABLE smart.permits ENABLE ROW LEVEL SECURITY;

--
-- Name: permits select_permit; Type: POLICY; Schema: smart; Owner: postgres
--

CREATE POLICY select_permit ON smart.permits FOR SELECT TO smart_user USING (smart.can_view_permit(id));


--
-- Name: sources select_source; Type: POLICY; Schema: smart; Owner: postgres
--

CREATE POLICY select_source ON smart.sources FOR SELECT TO smart_user USING (smart.can_view_source(id));


--
-- Name: sources; Type: ROW SECURITY; Schema: smart; Owner: postgres
--

ALTER TABLE smart.sources ENABLE ROW LEVEL SECURITY;

--
-- Name: permits update_permit; Type: POLICY; Schema: smart; Owner: postgres
--

CREATE POLICY update_permit ON smart.permits FOR UPDATE TO smart_user USING (smart.is_annotator());


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO smart_user;


--
-- Name: SCHEMA smart; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA smart TO smart_anonymous;
GRANT USAGE ON SCHEMA smart TO smart_user;


--
-- Name: FUNCTION notify_watchers_ddl(); Type: ACL; Schema: postgraphile_watch; Owner: postgres
--

REVOKE ALL ON FUNCTION postgraphile_watch.notify_watchers_ddl() FROM PUBLIC;


--
-- Name: FUNCTION notify_watchers_drop(); Type: ACL; Schema: postgraphile_watch; Owner: postgres
--

REVOKE ALL ON FUNCTION postgraphile_watch.notify_watchers_drop() FROM PUBLIC;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.armor(bytea) FROM PUBLIC;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.armor(bytea, text[], text[]) FROM PUBLIC;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.crypt(text, text) FROM PUBLIC;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.dearmor(text) FROM PUBLIC;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.decrypt(bytea, bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.decrypt_iv(bytea, bytea, bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.digest(bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.digest(text, text) FROM PUBLIC;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.encrypt(bytea, bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.encrypt_iv(bytea, bytea, bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.gen_random_bytes(integer) FROM PUBLIC;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.gen_random_uuid() FROM PUBLIC;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.gen_salt(text) FROM PUBLIC;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.gen_salt(text, integer) FROM PUBLIC;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.hmac(bytea, bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.hmac(text, text, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_armor_headers(text, OUT key text, OUT value text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_key_id(bytea) FROM PUBLIC;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea) FROM PUBLIC;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea) FROM PUBLIC;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea) FROM PUBLIC;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea) FROM PUBLIC;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_sym_encrypt(text, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_sym_encrypt(text, text, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text) FROM PUBLIC;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text) FROM PUBLIC;


--
-- Name: FUNCTION authenticate(username text, password text); Type: ACL; Schema: smart; Owner: postgres
--

GRANT ALL ON FUNCTION smart.authenticate(username text, password text) TO smart_anonymous;
GRANT ALL ON FUNCTION smart.authenticate(username text, password text) TO smart_user;


--
-- Name: FUNCTION can_view_permit(permit_id integer); Type: ACL; Schema: smart; Owner: postgres
--

REVOKE ALL ON FUNCTION smart.can_view_permit(permit_id integer) FROM PUBLIC;
GRANT ALL ON FUNCTION smart.can_view_permit(permit_id integer) TO smart_user;


--
-- Name: FUNCTION can_view_source(source_idx integer); Type: ACL; Schema: smart; Owner: postgres
--

REVOKE ALL ON FUNCTION smart.can_view_source(source_idx integer) FROM PUBLIC;
GRANT ALL ON FUNCTION smart.can_view_source(source_idx integer) TO smart_user;


--
-- Name: FUNCTION change_password(password text); Type: ACL; Schema: smart; Owner: postgres
--

REVOKE ALL ON FUNCTION smart.change_password(password text) FROM PUBLIC;
GRANT ALL ON FUNCTION smart.change_password(password text) TO smart_user;


--
-- Name: TABLE "user"; Type: ACL; Schema: smart; Owner: postgres
--

GRANT ALL ON TABLE smart."user" TO smart_user;


--
-- Name: FUNCTION "current_user"(); Type: ACL; Schema: smart; Owner: postgres
--

REVOKE ALL ON FUNCTION smart."current_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION smart."current_user"() TO smart_user;
GRANT ALL ON FUNCTION smart."current_user"() TO smart_anonymous;


--
-- Name: FUNCTION is_annotator(); Type: ACL; Schema: smart; Owner: postgres
--

REVOKE ALL ON FUNCTION smart.is_annotator() FROM PUBLIC;
GRANT ALL ON FUNCTION smart.is_annotator() TO smart_user;


--
-- Name: FUNCTION change_user_password(uid integer, password text); Type: ACL; Schema: smart_private; Owner: postgres
--

REVOKE ALL ON FUNCTION smart_private.change_user_password(uid integer, password text) FROM PUBLIC;


--
-- Name: FUNCTION register_user(username text, password text); Type: ACL; Schema: smart_private; Owner: postgres
--

REVOKE ALL ON FUNCTION smart_private.register_user(username text, password text) FROM PUBLIC;


--
-- Name: TABLE permits; Type: ACL; Schema: smart; Owner: postgres
--

GRANT SELECT,UPDATE ON TABLE smart.permits TO smart_user;


--
-- Name: TABLE sources; Type: ACL; Schema: smart; Owner: postgres
--

GRANT SELECT ON TABLE smart.sources TO smart_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" REVOKE ALL ON FUNCTIONS  FROM PUBLIC;


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_ddl();


ALTER EVENT TRIGGER postgraphile_watch_ddl OWNER TO "postgres";

--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_drop();


ALTER EVENT TRIGGER postgraphile_watch_drop OWNER TO "postgres";


-- Add dummy user
SELECT smart_private.register_user('smart', 'smart');