import { db } from '../db';
import { mealsTable } from '../db/schema';
import { ProtectedHttpRequest, HttpResponse } from '../types/Http';
import { badRequest, ok } from '../utils/http';
import z from 'zod';
import { randomUUID } from 'crypto';
import { s3Client } from '../clients/s3client'

const schema = z.object({
    fileType: z.enum(['audio/m4a', 'image/jpeg']),
});

export class CreateMealController {
    static async handle({userId, body}: ProtectedHttpRequest):Promise<HttpResponse>{
        const { success, error, data } = schema.safeParse(body);
        
        if (!success) {
            return badRequest({ erros: error.issues });
        }

        const stage = process.env.STAGE;

        console.log("Stage atual:", stage);

        const fileId = randomUUID();
        const ext = data.fileType === 'audio/m4a' ? '.m4a' : '.jpeg';
        const fileKey = `input_files/${userId}/${fileId}${ext}`;

        const presignedURL = await s3Client.getSignedUrlPromise('putObject', {
            Bucket: process.env.BUCKET_NAME,
            Key: fileKey,
            Expires: 600,
        });
        
        const [ meal ] = await db
        .insert(mealsTable)
        .values({
            userId,
            inputFileKey: fileKey,
            inputType: data.fileType === 'audio/m4a' ? 'audio' : 'picture',
            status: 'uploading',
            icon: '',
            name: '',
            foods: [],
        })
        .returning({
            id: mealsTable.id,
        });

        return ok({ 
            mealId: meal.id,
            uploadUrl: presignedURL,
        });
    }
}