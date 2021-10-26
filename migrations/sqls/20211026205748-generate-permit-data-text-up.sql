/* Replace with your SQL commands */

alter table smart.permits drop column permit_data_backup;
alter table smart.permits add column permit_data_text text generated always as (permit_data) STORED;

