import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { HttpRequest, HttpResponse } from '../types/Http';
import { badRequest, conflict, created } from '../utils/http';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { calculateGoals } from '../lib/calculateGoals';

const schema = z.object({
    goal: z.enum(['lose', 'maintain', 'gain']),
    gender: z.enum(['male', 'female']),
    birthDate: z.iso.date(),
    height: z.number(),
    weight: z.number(),
    activityLevel: z.number().int().min(1).max(5),
    account: z.object({
        name: z.string().min(3),
        email: z.email(),
        password: z.string().min(8).max(32)
    }),
});

export class SignUpController {
    static async handle({body}: HttpRequest):Promise<HttpResponse>{
        const { success, error, data } = schema.safeParse(body);

        if (!success) {
            return badRequest({ erros: error.issues });
        }

        const userAlreadyExists = await db.query.usersTable.findFirst({
            columns:{ 
                email: true 
            }, 
            where: eq(usersTable.email, data.account.email),
        });

        if (userAlreadyExists) {
            return conflict({ error: "This email is already in use." });
        }

        const { account, ...userData } = data;

        const goals = calculateGoals({
            activityLevel: data.activityLevel,
            birthDate: new Date(data.birthDate),
            gender: data.gender,
            goal: data.goal,
            height: data.height,
            weight: data.weight,
        })

        console.log('info', 'Calculated goals:', goals);

        const hashedPassword = await hash(account.password, 10);

        const [user] = await db
        .insert(usersTable)
        .values({
            ...userData,
            ...account,
            ...goals,
            password: hashedPassword,
        }).returning({
            id: usersTable.id,
        });

        return created({
            userId: user.id,
        });
    }
}