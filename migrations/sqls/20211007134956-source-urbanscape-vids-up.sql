alter table smart."sources" add column has_urbanscape_videos boolean default false;

-- comment out next line, isn't generic to schema
update smart.sources set has_urbanscape_videos = true where name = 'iMerit: Jacksonville'; 