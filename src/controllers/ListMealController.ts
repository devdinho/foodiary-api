import { and, eq, gte, lte } from 'drizzle-orm';
import { db } from '../db';
import { mealsTable, usersTable } from '../db/schema';
import { ProtectedHttpRequest, HttpResponse } from '../types/Http';
import { badRequest, ok } from '../utils/http';
import z from 'zod';

const schema = z.object({
    date: z.iso.date().transform(dateStr => new Date(dateStr)),
});

export class ListMealController {
    static async handle({userId, queryParams}: ProtectedHttpRequest):Promise<HttpResponse>{
        const { success, error, data } = schema.safeParse(queryParams);
        
        if (!success) {
            return badRequest({ erros: error.issues });
        }
        
        const endDate = new Date(data.date);
        endDate.setUTCHours(23, 59, 59, 999);

        const meals = await db.query.mealsTable.findMany({
            columns: {
                id: true,
                foods: true,
                createdAt: true,
                icon: true,
                name: true,
            },
            where: and(
                eq(mealsTable.userId, userId), 
                eq(mealsTable.status, 'success'),
                gte(mealsTable.createdAt, data.date),
                lte(mealsTable.createdAt, endDate),
            ) 
        })

        return ok({ meals });
    }
}