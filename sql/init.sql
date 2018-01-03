CREATE TABLE activities (
id uuid CONSTRAINT activities_pk PRIMARY KEY,
title varchar(255) NOT NULL,
description text,
status varchar(20) NOT NULL
);


CREATE TABLE expenses (
id uuid CONSTRAINT expenses_pk PRIMARY KEY,
title varchar(255) NOT NULL,
date timestamp NOT NULL,
amount integer NOT NULL,
activity_id uuid NOT NULL);

CREATE TABLE users (
id uuid CONSTRAINT user_pk PRIMARY KEY,
name varchar(255) NOT NULL,
firstname varchar(255) NOT NULL,
login varchar(255) NOT NULL,
password varchar(255) NOT NULL,
facebook_id varchar(255)
);


CREATE TABLE expenses_users (
expense_id uuid NOT NULL,
user_id uuid NOT NULL,
is_payer boolean,
parts_quantity integer NOT NULL,
split_amount integer NOT NULL);

CREATE TABLE activities_users (
activity_id uuid NOT NULL,
user_id uuid NOT NULL,
is_owner boolean);


ALTER TABLE "public"."expenses" ADD FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE SET NULL;

CREATE INDEX "expenses_user_idx" ON "public"."expenses_users"("expense_id","user_id");

CREATE INDEX "activities_users_idx" ON "public"."activities_users"("activity_id","user_id");
