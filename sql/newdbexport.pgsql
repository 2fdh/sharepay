--
-- PostgreSQL database dump
--



--
-- Erase the database
--

--DROP DATABASE [IF EXISTS] 'sharepay2fdh';


--
-- create the database
--

--CREATE DATABASE 'sharepay2fdh';


-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;





CREATE TABLE activities (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status character varying(20) NOT NULL
);




CREATE TABLE activities_attendees (
    activity_id uuid,
    attendee_id uuid
);




CREATE TABLE activities_users (
    activity_id uuid NOT NULL,
    user_id uuid NOT NULL
);




CREATE TABLE attendees (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255)
);





CREATE TABLE expenses (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    date timestamp without time zone NOT NULL,
    amount integer NOT NULL,
    activity_id uuid NOT NULL,
    payer_id uuid
);



CREATE TABLE expenses_attendees (
    expense_id uuid NOT NULL,
    attendee_id uuid NOT NULL
);



CREATE TABLE users (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL,
    login character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    facebook_id character varying(255)
);




COPY activities (id, title, description, status) FROM stdin;
bee2b457-5b3f-403a-95c1-819a694ea6b1	My first activity	amazing actity	Open
e28022df-9727-4a98-ab86-12bf9021050f	Réappro pot de fin	stage	Open
\.


--
-- Data for Name: activities_attendees; Type: TABLE DATA; Schema: public; Owner: Fabien
--

COPY activities_attendees (activity_id, attendee_id) FROM stdin;
bee2b457-5b3f-403a-95c1-819a694ea6b1	7d476145-f68f-4ee9-a501-f0c43d85cb7d\n
bee2b457-5b3f-403a-95c1-819a694ea6b1	e62a1758-c787-4772-886a-a015381bf9b4
bee2b457-5b3f-403a-95c1-819a694ea6b1	3f0e622e-bda1-42ff-939f-d6afe6b7e6ff
e28022df-9727-4a98-ab86-12bf9021050f	2645de87-8b51-4a50-96c3-06a1dc82204f
e28022df-9727-4a98-ab86-12bf9021050f	44d1cfb2-a9dd-491e-82b1-0414d27d94f8
\.


--
-- Data for Name: activities_users; Type: TABLE DATA; Schema: public; Owner: Fabien
--

COPY activities_users (activity_id, user_id) FROM stdin;
bee2b457-5b3f-403a-95c1-819a694ea6b1	d04479ef-a2a9-4b3c-8b6d-40fd49062aa1
e28022df-9727-4a98-ab86-12bf9021050f	134b1f24-d1f8-4091-b704-963acc2f8487
\.


--
-- Data for Name: attendees; Type: TABLE DATA; Schema: public; Owner: Fabien
--

COPY attendees (id, name, email) FROM stdin;
7d476145-f68f-4ee9-a501-f0c43d85cb7d	Dominique	\N
e62a1758-c787-4772-886a-a015381bf9b4	Virginie	\N
3f0e622e-bda1-42ff-939f-d6afe6b7e6ff	Romuald	\N
2645de87-8b51-4a50-96c3-06a1dc82204f	Emmanuel	\N
44d1cfb2-a9dd-491e-82b1-0414d27d94f8	Vincent	\N
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: Fabien
--

COPY expenses (id, title, date, amount, activity_id, payer_id) FROM stdin;
eabe76da-c4ef-4ac9-92d5-4f2a98db498b	Cahouètes	2018-01-01 17:23:54	1000	e28022df-9727-4a98-ab86-12bf9021050f	\N
93dea0cf-7605-41fe-bb2f-e56e648730bd	Café	2018-01-02 11:23:54	5000	bee2b457-5b3f-403a-95c1-819a694ea6b1	d04479ef-a2a9-4b3c-8b6d-40fd49062aa1
be59219a-992e-4c58-912f-8aac672117c4	Binouzes	2018-01-01 10:23:54	6000	e28022df-9727-4a98-ab86-12bf9021050f	134b1f24-d1f8-4091-b704-963acc2f8487
\.


--
-- Data for Name: expenses_attendees; Type: TABLE DATA; Schema: public; Owner: Fabien
--

COPY expenses_attendees (expense_id, attendee_id) FROM stdin;
be59219a-992e-4c58-912f-8aac672117c4	2645de87-8b51-4a50-96c3-06a1dc82204f
be59219a-992e-4c58-912f-8aac672117c4	44d1cfb2-a9dd-491e-82b1-0414d27d94f8
eabe76da-c4ef-4ac9-92d5-4f2a98db498b	2645de87-8b51-4a50-96c3-06a1dc82204f
93dea0cf-7605-41fe-bb2f-e56e648730bd	7d476145-f68f-4ee9-a501-f0c43d85cb7d
93dea0cf-7605-41fe-bb2f-e56e648730bd	e62a1758-c787-4772-886a-a015381bf9b4
93dea0cf-7605-41fe-bb2f-e56e648730bd	3f0e622e-bda1-42ff-939f-d6afe6b7e6ff
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: Fabien
--

COPY users (id, name, firstname, login, password, facebook_id) FROM stdin;
d04479ef-a2a9-4b3c-8b6d-40fd49062aa1	ALI	Hamza	hamza.ali@decathlon.com	03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4	\N
134b1f24-d1f8-4091-b704-963acc2f8487	GLORY	Fabien	fabien.glory@decathlon.com	03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4	\N
09d22b67-8871-4bd1-8988-4a33689a33d7	DUCATILLON	François	francois.ducatillon@decathlon.com	03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4	\N
629ff909-91b3-42ba-a9b3-0934720e9fba	LEPRETRE	Damien	damien.lepretre@decathlon.com	03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4	\N
\.


--
-- Name: activities activities_pk; Type: CONSTRAINT; Schema: public; Owner: Fabien
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT activities_pk PRIMARY KEY (id);


--
-- Name: attendees attendees_pkey; Type: CONSTRAINT; Schema: public; Owner: Fabien
--

ALTER TABLE ONLY attendees
    ADD CONSTRAINT attendees_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pk; Type: CONSTRAINT; Schema: public; Owner: Fabien
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT expenses_pk PRIMARY KEY (id);


--
-- Name: users user_pk; Type: CONSTRAINT; Schema: public; Owner: Fabien
--

ALTER TABLE ONLY users
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- Name: activities_users_idx; Type: INDEX; Schema: public; Owner: Fabien
--

CREATE INDEX activities_users_idx ON activities_users USING btree (activity_id, user_id);


--
-- Name: activity_id_attendee_id_idx; Type: INDEX; Schema: public; Owner: Fabien
--

CREATE INDEX activity_id_attendee_id_idx ON activities_attendees USING btree (activity_id, attendee_id);


--
-- Name: expenses_user_idx; Type: INDEX; Schema: public; Owner: Fabien
--

CREATE INDEX expenses_user_idx ON expenses_attendees USING btree (expense_id, attendee_id);


--
-- Name: expenses expenses_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Fabien
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT expenses_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--
