alter smart.permits drop column permit_data_text ;
alter smart.permits add column permit_data_backup text;
update smart.permits set permit_data_backup=permit_data;