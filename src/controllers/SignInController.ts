import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { HttpRequest, HttpResponse } from '../types/Http';
import { badRequest, ok, unauthorized } from '../utils/http';
import { z } from 'zod';
import { compare } from 'bcryptjs';
import { signAccessTokenFor } from '../lib/jwt';

const schema = z.object({
    email: z.email(),
    password: z.string().min(8).max(16),
});

export class SignInController {
    static async handle({body}: HttpRequest):Promise<HttpResponse>{
        const { success, error, data } = schema.safeParse(body);

        if (!success) {
            return badRequest({ erros: error.issues });
        }

        const user = await db.query.usersTable.findFirst({
            columns:{
                id: true,
                name: true,
                email: true,
                password: true,
            },
            where: eq(usersTable.email, data.email),
        });

        if (!user || !await compare(data.password, user.password)) {
            return unauthorized({ error: "Invalid credentials." });
        }

        const accessToken = signAccessTokenFor(user.id);

        return ok({
            accessToken,
        });
    }
}