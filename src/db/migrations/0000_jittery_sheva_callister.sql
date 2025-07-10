DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'AccountType' AND n.nspname = 'public'
    ) THEN
        CREATE TYPE "public"."AccountType" AS ENUM('CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT');
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'InstallmentStatus' AND n.nspname = 'public'
    ) THEN
        CREATE TYPE "public"."InstallmentStatus" AS ENUM('PENDING', 'PAID', 'OVERDUE', 'DRAFT');
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'TransactionType' AND n.nspname = 'public'
    ) THEN
        CREATE TYPE "public"."TransactionType" AS ENUM('DEBIT', 'CREDIT');
    END IF;
END$$;
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"type" "AccountType" NOT NULL,
	"balance" numeric DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"amount" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"color" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "categories_user_name_unique" UNIQUE("user_id","name")
);
CREATE TABLE "installments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unit_value" numeric NOT NULL,
	"due_date" timestamp NOT NULL,
	"status" "InstallmentStatus" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"invoice_id" uuid NOT NULL
);
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"unit_value" numeric NOT NULL,
	"total_installments" smallint NOT NULL,
	"issue_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" uuid NOT NULL
);
CREATE TABLE "payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_methods_code_unique" UNIQUE("code")
);
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" numeric NOT NULL,
	"type" "TransactionType" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"installment_id" uuid,
	"payment_method_id" uuid NOT NULL,
	"account_id" uuid NOT NULL
);
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"avatar_url" varchar,
	"password" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "installments" ADD CONSTRAINT "installments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_installment_id_installments_id_fk" FOREIGN KEY ("installment_id") REFERENCES "public"."installments"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_method_id_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");
CREATE INDEX "accounts_type_idx" ON "accounts" USING btree ("type");
CREATE INDEX "accounts_created_at_idx" ON "accounts" USING btree ("created_at");
CREATE INDEX "budgets_user_id_idx" ON "budgets" USING btree ("user_id");
CREATE INDEX "budgets_category_id_idx" ON "budgets" USING btree ("category_id");
CREATE INDEX "budgets_created_at_idx" ON "budgets" USING btree ("created_at");
CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
CREATE INDEX "categories_user_id_idx" ON "categories" USING btree ("user_id");
CREATE INDEX "installments_invoice_id_idx" ON "installments" USING btree ("invoice_id");
CREATE INDEX "installments_due_date_idx" ON "installments" USING btree ("due_date");
CREATE INDEX "installments_status_idx" ON "installments" USING btree ("status");
CREATE INDEX "installments_created_at_idx" ON "installments" USING btree ("created_at");
CREATE INDEX "invoices_user_id_idx" ON "invoices" USING btree ("user_id");
CREATE INDEX "invoices_category_id_idx" ON "invoices" USING btree ("category_id");
CREATE INDEX "invoices_created_at_idx" ON "invoices" USING btree ("created_at");
CREATE INDEX "payment_methods_code_idx" ON "payment_methods" USING btree ("code");
CREATE INDEX "payment_methods_is_active_idx" ON "payment_methods" USING btree ("is_active");
CREATE INDEX "payment_methods_created_at_idx" ON "payment_methods" USING btree ("created_at");
CREATE INDEX "transactions_installment_id_idx" ON "transactions" USING btree ("installment_id");
CREATE INDEX "transactions_payment_method_id_idx" ON "transactions" USING btree ("payment_method_id");
CREATE INDEX "transactions_account_id_idx" ON "transactions" USING btree ("account_id");
CREATE INDEX "transactions_type_idx" ON "transactions" USING btree ("type");
CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");
