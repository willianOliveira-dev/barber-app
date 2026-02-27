ALTER TABLE "barbershop" ALTER COLUMN "streetNumber" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "barbershop" ADD COLUMN "neighborhood" varchar(100);