CREATE TABLE "public"."orders" (
    "or_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "or_date" timestamp NOT NULL,
    "or_total_price" int4 NOT NULL,
    "shipments_ship_id" uuid NOT NULL,
    "users_us_id" uuid NOT NULL,
    "payments_p_id" uuid NOT NULL,
    CONSTRAINT "orders_payments" FOREIGN KEY ("payments_p_id") REFERENCES "public"."payments"("p_id"),
    CONSTRAINT "orders_users" FOREIGN KEY ("users_us_id") REFERENCES "public"."users"("us_id"),
    CONSTRAINT "orders_shipments" FOREIGN KEY ("shipments_ship_id") REFERENCES "public"."shipments"("ship_id"),
    PRIMARY KEY ("or_id")
);

CREATE TABLE "public"."payments" (
    "p_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "p_date" timestamp NOT NULL,
    "p_method" varchar(20) NOT NULL,
    PRIMARY KEY ("p_id")
);

CREATE TABLE "public"."products" (
    "pr_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "pr_name" varchar(20) NOT NULL,
    "pr_price" int4 NOT NULL,
    "pr_description" varchar(255) NOT NULL,
    "pr_quantity" int4 NOT NULL,
    "pr_images" bytea NOT NULL,
    "suppliers_sup_id" uuid NOT NULL,
    "products_categories_cat_id" uuid NOT NULL,
    CONSTRAINT "products_suppliers" FOREIGN KEY ("suppliers_sup_id") REFERENCES "public"."suppliers"("sup_id"),
    CONSTRAINT "products_products_categories" FOREIGN KEY ("products_categories_cat_id") REFERENCES "public"."products_categories"("cat_id"),
    PRIMARY KEY ("pr_id")
);

CREATE TABLE "public"."products_categories" (
    "cat_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "cat_name" varchar(20) NOT NULL,
    "cat_description" varchar(255) NOT NULL,
    PRIMARY KEY ("cat_id")
);

CREATE TABLE "public"."products_orders" (
    "orders_or_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "products_pr_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "or_total_amount" int4 NOT NULL,
    CONSTRAINT "products_orders_orders" FOREIGN KEY ("orders_or_id") REFERENCES "public"."orders"("or_id"),
    CONSTRAINT "products_orders_products" FOREIGN KEY ("products_pr_id") REFERENCES "public"."products"("pr_id"),
    PRIMARY KEY ("orders_or_id","products_pr_id")
);

CREATE TABLE "public"."products_reviews" (
    "pr_r_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "pr_r_rating" int4 NOT NULL,
    "pr_r_review" text NOT NULL,
    "pr_r_images" bytea NOT NULL,
    "products_pr_id" uuid NOT NULL,
    CONSTRAINT "products_reviews_products" FOREIGN KEY ("products_pr_id") REFERENCES "public"."products"("pr_id"),
    PRIMARY KEY ("pr_r_id")
);

CREATE TABLE "public"."shipments" (
    "ship_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "ship_name" varchar(255) NOT NULL,
    "ship_date" date NOT NULL,
    "ship_address" varchar(255) NOT NULL,
    "ship_contact" varchar(15) NOT NULL,
    "ship_postal_code" bpchar(5) NOT NULL,
    "ship_status" bool NOT NULL,
    PRIMARY KEY ("ship_id")
);

CREATE TABLE "public"."suppliers" (
    "sup_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "sup_name" varchar(20) NOT NULL,
    "sup_address" varchar(255) NOT NULL,
    "sup_contact" varchar(15) NOT NULL,
    PRIMARY KEY ("sup_id")
);

CREATE TABLE "public"."users" (
    "us_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "us_name" varchar(20) NOT NULL,
    "us_address" varchar(255) NOT NULL,
    "us_contact" varchar(15) NOT NULL,
    "us_province" varchar(20) NOT NULL,
    "us_city" varchar(20) NOT NULL,
    "us_postal_code" bpchar(5) NOT NULL,
    "us_rewards" int4 NOT NULL DEFAULT 1,
    "us_role" int4 NOT NULL DEFAULT 1,
    PRIMARY KEY ("us_id")
);