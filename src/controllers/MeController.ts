import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { ProtectedHttpRequest, HttpResponse } from '../types/Http';
import { ok } from '../utils/http';

export class MeController {
    static async handle({userId}: ProtectedHttpRequest):Promise<HttpResponse>{
        const user = await db.query.usersTable.findFirst({
            where:eq(usersTable.id, userId),
            columns:{
                id: true,
                name: true,
                email: true,
                calories: true,
                proteins: true,
                carbohydrates: true,
                fats: true,
            }
        });
        
        return ok({ user});
    }
}