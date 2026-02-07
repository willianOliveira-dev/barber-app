import 'dotenv/config'
import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.url().nonoptional(),
});

export const env = envSchema.parse(process.env);
