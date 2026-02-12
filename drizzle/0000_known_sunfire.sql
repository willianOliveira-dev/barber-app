CREATE TYPE "public"."user_role" AS ENUM('barber', 'customer');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('confirmed', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"image" varchar(500),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone,
	"password" text,
	"phone" varchar(20),
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	"barbershopId" uuid,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "barbershop" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"image" varchar(500),
	"ownerId" uuid NOT NULL,
	"description" text,
	"slug" varchar(200) NOT NULL,
	"address" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(50) NOT NULL,
	"zipCode" varchar(20),
	"phone" varchar(20),
	"email" varchar(255),
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "barbershop_service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image" varchar(500),
	"name" varchar(150) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"description" text,
	"barbershopId" uuid NOT NULL,
	"categoryId" uuid,
	"durationMinutes" integer NOT NULL,
	"priceInCents" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"serviceId" uuid NOT NULL,
	"barbershopId" uuid NOT NULL,
	"scheduledAt" timestamp with time zone NOT NULL,
	"endTime" timestamp with time zone NOT NULL,
	"status" "booking_status" DEFAULT 'confirmed' NOT NULL,
	"notes" varchar(500),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"cancelledAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_unique" UNIQUE("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" uuid NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "available_time_slot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbershopId" uuid NOT NULL,
	"startTime" timestamp with time zone NOT NULL,
	"endTime" timestamp with time zone NOT NULL,
	"isAvailable" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barbershop_hour" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbershopId" uuid NOT NULL,
	"dayOfWeek" "day_of_week" NOT NULL,
	"openingTime" varchar(5) NOT NULL,
	"closingTime" varchar(5) NOT NULL,
	"isOpen" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barbershop_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barbershopId" uuid NOT NULL,
	"isOpen" boolean DEFAULT true NOT NULL,
	"reason" text,
	"closedUntil" timestamp with time zone,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"description" text,
	"icon" varchar(100),
	"image" varchar(500),
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "barbershop" ADD CONSTRAINT "barbershop_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barbershop_service" ADD CONSTRAINT "barbershop_service_barbershopId_barbershop_id_fk" FOREIGN KEY ("barbershopId") REFERENCES "public"."barbershop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barbershop_service" ADD CONSTRAINT "barbershop_service_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_serviceId_barbershop_service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."barbershop_service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_barbershopId_barbershop_id_fk" FOREIGN KEY ("barbershopId") REFERENCES "public"."barbershop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "available_time_slot" ADD CONSTRAINT "available_time_slot_barbershopId_barbershop_id_fk" FOREIGN KEY ("barbershopId") REFERENCES "public"."barbershop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barbershop_hour" ADD CONSTRAINT "barbershop_hour_barbershopId_barbershop_id_fk" FOREIGN KEY ("barbershopId") REFERENCES "public"."barbershop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barbershop_status" ADD CONSTRAINT "barbershop_status_barbershopId_barbershop_id_fk" FOREIGN KEY ("barbershopId") REFERENCES "public"."barbershop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_email_index" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_role_index" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_barbershop_index" ON "user" USING btree ("barbershopId");--> statement-breakpoint
CREATE INDEX "barbershops_owner_index" ON "barbershop" USING btree ("ownerId");--> statement-breakpoint
CREATE UNIQUE INDEX "barbershops_owner_slug_unique" ON "barbershop" USING btree ("slug","ownerId");--> statement-breakpoint
CREATE INDEX "barbershops_name_index" ON "barbershop" USING btree ("name");--> statement-breakpoint
CREATE INDEX "barbershops_city_index" ON "barbershop" USING btree ("city");--> statement-breakpoint
CREATE INDEX "services_name_index" ON "barbershop_service" USING btree ("name");--> statement-breakpoint
CREATE INDEX "services_barbershop_index" ON "barbershop_service" USING btree ("barbershopId");--> statement-breakpoint
CREATE INDEX "services_category_index" ON "barbershop_service" USING btree ("categoryId");--> statement-breakpoint
CREATE UNIQUE INDEX "services_slug_unique" ON "barbershop_service" USING btree ("barbershopId","slug");--> statement-breakpoint
CREATE INDEX "booking_user_index" ON "booking" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "booking_service_index" ON "booking" USING btree ("serviceId");--> statement-breakpoint
CREATE INDEX "booking_barbershop_index" ON "booking" USING btree ("barbershopId");--> statement-breakpoint
CREATE INDEX "booking_status_index" ON "booking" USING btree ("status");--> statement-breakpoint
CREATE INDEX "booking_scheduled_at_index" ON "booking" USING btree ("scheduledAt");--> statement-breakpoint
CREATE INDEX "available_time_slot_barbershop_index" ON "available_time_slot" USING btree ("barbershopId");--> statement-breakpoint
CREATE INDEX "available_time_slot_start_time_index" ON "available_time_slot" USING btree ("startTime");--> statement-breakpoint
CREATE INDEX "barbershop_hours_index" ON "barbershop_hour" USING btree ("barbershopId");--> statement-breakpoint
CREATE INDEX "barbershop_status_index" ON "barbershop_status" USING btree ("barbershopId");--> statement-breakpoint
CREATE INDEX "category_name_index" ON "category" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "category_slug_unique" ON "category" USING btree ("slug");