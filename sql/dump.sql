--
-- PostgreSQL database dump
--

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

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE activities (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status character varying(20) NOT NULL
);


--
-- Name: activities_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE activities_users (
    activity_id uuid NOT NULL,
    user_id uuid NOT NULL,
    is_owner boolean
);


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE expenses (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    date timestamp without time zone NOT NULL,
    amount integer NOT NULL,
    activity_id uuid NOT NULL
);


--
-- Name: expenses_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE expenses_users (
    expense_id uuid NOT NULL,
    user_id uuid NOT NULL,
    is_payer boolean,
    parts_quantity integer NOT NULL,
    split_amount integer NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL,
    login character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    facebook_id character varying(255)
);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY activities (id, title, description, status) FROM stdin;
bee2b457-5b3f-403a-95c1-819a694ea6b1	My first activity	amazing actity	Open
e28022df-9727-4a98-ab86-12bf9021050f	Réappro pot de fin	stage	Open
\.


--
-- Data for Name: activities_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY activities_users (activity_id, user_id, is_owner) FROM stdin;
bee2b457-5b3f-403a-95c1-819a694ea6b1	d04479ef-a2a9-4b3c-8b6d-40fd49062aa1	t
bee2b457-5b3f-403a-95c1-819a694ea6b1	134b1f24-d1f8-4091-b704-963acc2f8487	f
bee2b457-5b3f-403a-95c1-819a694ea6b1	09d22b67-8871-4bd1-8988-4a33689a33d7	f
bee2b457-5b3f-403a-95c1-819a694ea6b1	629ff909-91b3-42ba-a9b3-0934720e9fba	f
e28022df-9727-4a98-ab86-12bf9021050f	d04479ef-a2a9-4b3c-8b6d-40fd49062aa1	f
e28022df-9727-4a98-ab86-12bf9021050f	134b1f24-d1f8-4091-b704-963acc2f8487	t
e28022df-9727-4a98-ab86-12bf9021050f	09d22b67-8871-4bd1-8988-4a33689a33d7	f
e28022df-9727-4a98-ab86-12bf9021050f	629ff909-91b3-42ba-a9b3-0934720e9fba	f
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY expenses (id, title, date, amount, activity_id) FROM stdin;
be59219a-992e-4c58-912f-8aac672117c4	Binouzes	2018-01-01 10:23:54	6000	e28022df-9727-4a98-ab86-12bf9021050f
eabe76da-c4ef-4ac9-92d5-4f2a98db498b	Cahouètes	2018-01-01 17:23:54	1000	e28022df-9727-4a98-ab86-12bf9021050f
93dea0cf-7605-41fe-bb2f-e56e648730bd	Café	2018-01-02 11:23:54	5000	bee2b457-5b3f-403a-95c1-819a694ea6b1
\.


--
-- Data for Name: expenses_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY expenses_users (expense_id, user_id, is_payer, parts_quantity, split_amount) FROM stdin;
be59219a-992e-4c58-912f-8aac672117c4	d04479ef-a2a9-4b3c-8b6d-40fd49062aa1	t	1	1500
be59219a-992e-4c58-912f-8aac672117c4	134b1f24-d1f8-4091-b704-963acc2f8487	f	1	1500
be59219a-992e-4c58-912f-8aac672117c4	09d22b67-8871-4bd1-8988-4a33689a33d7	f	1	1500
be59219a-992e-4c58-912f-8aac672117c4	629ff909-91b3-42ba-a9b3-0934720e9fba	f	1	1500
eabe76da-c4ef-4ac9-92d5-4f2a98db498b	d04479ef-a2a9-4b3c-8b6d-40fd49062aa1	f	1	250
eabe76da-c4ef-4ac9-92d5-4f2a98db498b	134b1f24-d1f8-4091-b704-963acc2f8487	t	1	250
eabe76da-c4ef-4ac9-92d5-4f2a98db498b	09d22b67-8871-4bd1-8988-4a33689a33d7	f	1	250
eabe76da-c4ef-4ac9-92d5-4f2a98db498b	629ff909-91b3-42ba-a9b3-0934720e9fba	f	1	250
93dea0cf-7605-41fe-bb2f-e56e648730bd	d04479ef-a2a9-4b3c-8b6d-40fd49062aa1	f	1	1250
93dea0cf-7605-41fe-bb2f-e56e648730bd	134b1f24-d1f8-4091-b704-963acc2f8487	f	1	1250
93dea0cf-7605-41fe-bb2f-e56e648730bd	09d22b67-8871-4bd1-8988-4a33689a33d7	t	1	1250
93dea0cf-7605-41fe-bb2f-e56e648730bd	629ff909-91b3-42ba-a9b3-0934720e9fba	f	1	1250
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users (id, name, firstname, login, password, facebook_id) FROM stdin;
d04479ef-a2a9-4b3c-8b6d-40fd49062aa1	ALI	Hamza	hamza.ali@decathlon.com	03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4	\N
134b1f24-d1f8-4091-b704-963acc2f8487	GLORY	Fabien	fabien.glory@decathlon.com	03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4	\N
09d22b67-8871-4bd1-8988-4a33689a33d7	DUCATILLON	François	francois.ducatillon@decathlon.com	03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4	\N
629ff909-91b3-42ba-a9b3-0934720e9fba	LEPRETRE	Damien	damien.lepretre@decathlon.com	03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4	\N
\.


--
-- Name: activities activities_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY activities
    ADD CONSTRAINT activities_pk PRIMARY KEY (id);


--
-- Name: expenses expenses_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT expenses_pk PRIMARY KEY (id);


--
-- Name: users user_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT user_pk PRIMARY KEY (id);


--
-- Name: activities_users_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activities_users_idx ON activities_users USING btree (activity_id, user_id);


--
-- Name: expenses_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX expenses_user_idx ON expenses_users USING btree (expense_id, user_id);


--
-- Name: expenses expenses_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT expenses_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--
