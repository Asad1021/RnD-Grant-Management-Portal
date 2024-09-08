-- drop table if exists admin;
-- create table admin(
--     email_id text, 
--     name text--, 
--   --  admin integer,
--    -- department text
-- );
-- drop table if exists student;
-- create table student(
--     email_id text, 
--     name text, 
--    -- admin integer,
--     department text
-- );
-- drop table if exists prof;
-- create table prof(
--     email_id text, 
--     name text, 
--     --admin integer,
--     department text
-- );

CREATE DATABASE rnd_modified;

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

drop table if exists users;
create table users(
    email_id text Primary key, 
    user_name text, 
    admin integer,
    department text
);

drop table if exists projects;
create table projects(
    project_id text PRIMARY KEY,
    project_title text,
    project_grant integer, 
    comment_time timestamp with time zone,
    pi text,
    co_pi text,
    dept text,
    fund_agency text,
    sanc_order_no text,
    sanctioned_date text,
    duration text,
    dos text,
    doc text,
    start_year text,
    is_appr integer default 0,
    is_running integer default 0,
    drive_link text DEFAULT NULL,
    comm_flag integer default 0
);

drop table if exists user_project;
create table user_project(
    email_id text References users(email_id),
    project_id text References projects(project_id),
    PRIMARY KEY (email_id, project_id)
);

drop table if exists main_table;
create table main_table(
    project_id text References projects(project_id),
    sr int ,
    particulars text,
    remarks text ,
    vouchNo text,
    rec text ,
    payment int ,
    balance int ,
    heads text ,
    comm_flag int ,
    actual_flag int
);

drop table if exists comment_table;
create table comment_table(
    project_id text References projects(project_id),
    sr text,
    comment text,
    person text,
    comment_time TIMESTAMP with time zone,
    resolved text
);

-- drop table if exists fellow_table;
-- create table fellow_table(
--     project_id text References projects(project_id),
--     email_id text References users(email_id)
-- );

drop table if exists summary_table;
create table summary_table(
    project_id text References projects(project_id),
    sr int,
    heads text,
    sanctioned_amount int,
    year_1_funds int,
    year_2_funds int,
    year_3_funds int,
    expenditure int,
    balance int,
    comm_flag int
);

drop table if exists summary_comment_table;
create table summary_comment_table(
    project_id text References projects(project_id),
    sr int,
    comment text,
    person text,
    comment_time TIMESTAMP with time zone,
    resolved text
);


drop table if exists OTPs;
create table OTPs(
    email_id text PRIMARY KEY,
    otp text,
    createTime TIMESTAMP with time zone,
    endTime TIMESTAMP with time zone
);


insert into users(email_id, user_name, admin) values('2021csb1271@iitrpr.ac.in', 'Asad', 1);
insert into users(email_id, user_name, admin) values('2021csb1069@iitrpr.ac.in', 'Anshika', 1);
insert into users(email_id, user_name, admin) values('2021csb1132@iitrpr.ac.in', 'Shiva', 1);
insert into users(email_id, user_name, admin) values('2021csb1067@iitrpr.ac.in', 'Anisha', 1);
select * from users;