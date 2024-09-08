
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- drop table if exists projects;
-- create table projects(
--     project_id text PRIMARY KEY,
--     project_title text, 
--     professor_list text, 
--     project_grant integer, 
--     comment_time timestamp with time zone,
--     pi text,
--     co_pi text,
--     dept text,
--     fund_agency text,
--     sanc_order_no text,
--     sanctioned_date text,
--     duration text,
--     dos text,   
--     doc text,
--     start_year text,
--     is_appr integer default 0,
--     is_running integer default 0,
--     drive_link text DEFAULT NULL,
--     comm_flag integer default 0
-- );


drop table if exists users;
create table users(
    email_id text, 
    user_name text, 
    admin integer,
    department text
);

insert into users(email_id, user_name, admin) values('2021csb1271@iitrpr.ac.in', 'Asad', 2);
insert into users(email_id, user_name, admin) values('2021csb1132@iitrpr.ac.in', 'Shiva', 1);
insert into users(email_id, user_name, admin) values('2021csb1069@iitrpr.ac.in', 'Anshika', 1);
insert into users(email_id, user_name, admin) values('2021csb1067@iitrpr.ac.in', 'Anisha', 1);
insert into users(email_id, user_name, admin) values('dep.p03.2024@gmail.com', 'DEP_Admin', 1);
select * from users;


-- insert into users(email_id, user_name, admin) values('2020csb1097@iitrpr.ac.in', 'Vishnu', 1);
-- insert into users(email_id, user_name, admin) values('2020csb1087@iitrpr.ac.in', 'Sreya', 1);
-- insert into users(email_id, user_name, admin) values('2020csb1083@iitrpr.ac.in', 'Lashi', 1);
-- insert into users(email_id, user_name, admin) values('2021csb1067@iitrpr.ac.in', 'ANISHA', 1);
-- insert into users(email_id, user_name, admin) values('anishaprakashmbec@gmail.com', 'ANISHA', 1);
-- select * from users;
