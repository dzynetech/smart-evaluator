create table smart.users_sources(
	id serial primary KEY,
	user_id int,
	source_id int,

	CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES smart.user(id),

	CONSTRAINT fk_source
      FOREIGN KEY(source_id) 
	  REFERENCES smart.sources(id)

)