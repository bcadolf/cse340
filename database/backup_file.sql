--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 16.8 (Homebrew)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: cse340bca2
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO cse340bca2;

--
-- Name: account_type; Type: TYPE; Schema: public; Owner: cse340bca2
--

CREATE TYPE public.account_type AS ENUM (
    'Client',
    'Employee',
    'Admin'
);


ALTER TYPE public.account_type OWNER TO cse340bca2;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: cse340bca2
--

CREATE TABLE public.account (
    account_id integer NOT NULL,
    account_firstname character varying NOT NULL,
    account_lastname character varying NOT NULL,
    account_email character varying NOT NULL,
    account_password character varying NOT NULL,
    account_type public.account_type DEFAULT 'Client'::public.account_type NOT NULL
);


ALTER TABLE public.account OWNER TO cse340bca2;

--
-- Name: account_account_id_seq; Type: SEQUENCE; Schema: public; Owner: cse340bca2
--

ALTER TABLE public.account ALTER COLUMN account_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.account_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: classification; Type: TABLE; Schema: public; Owner: cse340bca2
--

CREATE TABLE public.classification (
    classification_id integer NOT NULL,
    classification_name character varying NOT NULL
);


ALTER TABLE public.classification OWNER TO cse340bca2;

--
-- Name: classification_classification_id_seq; Type: SEQUENCE; Schema: public; Owner: cse340bca2
--

ALTER TABLE public.classification ALTER COLUMN classification_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.classification_classification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: cse340bca2
--

CREATE TABLE public.inventory (
    inv_id integer NOT NULL,
    inv_make character varying NOT NULL,
    inv_model character varying NOT NULL,
    inv_year character(4) NOT NULL,
    inv_description text NOT NULL,
    inv_image character varying NOT NULL,
    inv_thumbnail character varying NOT NULL,
    inv_price numeric(9,0) NOT NULL,
    inv_miles integer NOT NULL,
    inv_color character varying NOT NULL,
    classification_id integer NOT NULL
);


ALTER TABLE public.inventory OWNER TO cse340bca2;

--
-- Name: inventory_inv_id_seq; Type: SEQUENCE; Schema: public; Owner: cse340bca2
--

ALTER TABLE public.inventory ALTER COLUMN inv_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.inventory_inv_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: cse340bca2
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO cse340bca2;

--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: cse340bca2
--

COPY public.account (account_id, account_firstname, account_lastname, account_email, account_password, account_type) FROM stdin;
3	Jack	Frost	jf@testing.com	$2b$10$5yMVWwnz57/FH/CO3OsOnuELWvKsESxg/dfXPH4EDcy5BNis6F4NO	Client
4	New	Guy	ng@testing.com	$2b$10$Gt.OX8mtoEpxV.YSq8S7V.qVhIFm8HPSI/5VuJ3HfeGuQ1ldyxA96	Client
5	Basic	Client	basic@340.edu	$2b$10$/HIfzVsI00FxkxxRErFhhO8Ukh.pSdy8PTcM5SuXGV1VZ5FPFJWRK	Client
6	Happy	Employee	happy@340.edu	$2b$10$i96yIpdsdU5J2Hg/9wQ4Ie8HvgbMLQ7mCbEriqHzk5PvERRq7Bf1K	Employee
7	Manager	User	manager@340.edu	$2b$10$fQzdaNoJZV08Ws8YhMnieuAiTw6syubjRXZW3wVdVUcIV0hHAm4YG	Admin
\.


--
-- Data for Name: classification; Type: TABLE DATA; Schema: public; Owner: cse340bca2
--

COPY public.classification (classification_id, classification_name) FROM stdin;
1	Custom
2	Sport
3	SUV
4	Truck
5	Sedan
6	Electric
8	Hydrogen
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: cse340bca2
--

COPY public.inventory (inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) FROM stdin;
1	Chevy	Camaro	2018	If you want to look cool this is the ar you need! This car has great performance at an affordable price. Own it today!	/images/vehicles/camaro.jpg	/images/vehicles/camaro-tn.jpg	25000	101222	Silver	2
3	FBI	Surveillance Van	2016	Do you like police shows? You will feel right at home driving this van, comes complete with survalence equipments for and extra fee of $2,000 a month.	/images/vehicles/survan.jpg	/images/vehicles/survan-tn.jpg	20000	19851	Brown	1
4	Dog 	Car	1997	Do you like dogs? Well this car is for you straight from the 90s from Aspen, Colorado we have the orginal Dog Car complete with fluffy ears.	/images/vehicles/dog-car.jpg	/images/vehicles/dog-car-tn.jpg	35000	71632	White	1
5	Jeep	Wrangler	2019	The Jeep Wrangler is small and compact with enough power to get you where you want to go. Its great for everyday driving as well as offroading weather that be on the the rocks or in the mud!	/images/vehicles/wrangler.jpg	/images/vehicles/wrangler-tn.jpg	28045	41205	Yellow	3
6	Lamborghini	Adventador	2016	This V-12 engine packs a punch in this sporty car. Make sure you wear your seatbelt and obey all traffic laws. 	/images/vehicles/adventador.jpg	/images/vehicles/adventador-tn.jpg	417650	71003	Blue	2
7	Aerocar International	Aerocar	1963	Are you sick of rushhour trafic? This car converts into an airplane to get you where you are going fast. Only 6 of these were made, get them while they last!	/images/vehicles/aerocar.jpg	/images/vehicles/aerocar-tn.jpg	700000	18956	Red	1
8	Monster	Truck	1995	Most trucks are for working, this one is for fun. This beast comes with 60 inch tires giving you traction needed to jump and roll in the mud.	/images/vehicles/monster-truck.jpg	/images/vehicles/monster-truck-tn.jpg	150000	3998	purple	1
9	Cadillac	Escalade	2019	This stylin car is great for any occasion from going to the beach to meeting the president. The luxurious inside makes this car a home away from home.	/images/vehicles/escalade.jpg	/images/vehicles/escalade-tn.jpg	75195	41958	Black	4
11	Mechanic	Special	1964	Not sure where this car came from. however with a little tlc it will run as good a new.	/images/vehicles/mechanic.jpg	/images/vehicles/mechanic-tn.jpg	100	200125	Rust	5
12	Ford	Model T	1921	The Ford Model T can be a bit tricky to drive. It was the first car to be put into production. You can get it in any color you want as long as it is black.	/images/vehicles/model-t.jpg	/images/vehicles/model-t-tn.jpg	30000	26357	Black	5
13	Mystery	Machine	1999	Scooby and the gang always found luck in solving their mysteries because of there 4 wheel drive Mystery Machine. This Van will help you do whatever job you are required to with a success rate of 100%.	/images/vehicles/mystery-van.jpg	/images/vehicles/mystery-van-tn.jpg	10000	128564	Green	1
2	Batmobile	Custom	2007	Ever want to be a super hero? now you can with the batmobile. This car allows you to switch to bike mode allowing you to easily maneuver through traffic during rush hour.	/images/vehicles/batmobile.jpg	/images/vehicles/batmobile-tn.jpg	65000	29887	Black	1
14	Spartan	Fire Truck	2012	Emergencies happen often. Be prepared with this Spartan fire truck. Comes complete with 1000 ft. of hose and a 1000 gallon tank.	/images/vehicles/fire-truck.jpg	/images/vehicles/fire-truck-tn.jpg	50000	38522	Red	4
15	Ford	Crown Victoria	2013	After the police force updated their fleet these cars are now available to the public! These cars come equiped with the siren which is convenient for college students running late to class.	/images/vehicles/crwn-vic.jpg	/images/vehicles/crwn-vic-tn.jpg	10000	108247	White	5
10	GM	Hummer	2016	Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.	/images/vehicles/hummer.jpg	/images/vehicles/hummer-tn.jpg	58800	56564	Yellow	4
17	toyota	camry	2019	This is a very nice car	/images/vehicles/no-image.png	/images/vehicles/no-image.png	40000	2000	black	8
16	Rivian	R1S	2024	A large electric SUV top of the line.	/images/vehicles/no-image.png	/images/vehicles/no-image-tn.png	60000	90000	Midnight Black	6
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: cse340bca2
--

COPY public.session (sid, sess, expire) FROM stdin;
3tF9ijeLZl-yuMptS2U_t0JcskaPMFKp	{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"flash":{}}	2025-04-07 20:27:57
\.


--
-- Name: account_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cse340bca2
--

SELECT pg_catalog.setval('public.account_account_id_seq', 7, true);


--
-- Name: classification_classification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cse340bca2
--

SELECT pg_catalog.setval('public.classification_classification_id_seq', 8, true);


--
-- Name: inventory_inv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cse340bca2
--

SELECT pg_catalog.setval('public.inventory_inv_id_seq', 17, true);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: cse340bca2
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);


--
-- Name: classification classification_pk; Type: CONSTRAINT; Schema: public; Owner: cse340bca2
--

ALTER TABLE ONLY public.classification
    ADD CONSTRAINT classification_pk PRIMARY KEY (classification_id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: cse340bca2
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (inv_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: cse340bca2
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: cse340bca2
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: inventory fk_classification; Type: FK CONSTRAINT; Schema: public; Owner: cse340bca2
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT fk_classification FOREIGN KEY (classification_id) REFERENCES public.classification(classification_id) ON UPDATE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO cse340bca2;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO cse340bca2;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO cse340bca2;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO cse340bca2;


--
-- PostgreSQL database dump complete
--

