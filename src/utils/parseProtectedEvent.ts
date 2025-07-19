import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { HttpRequest } from '../types/Http';
import { parseEvent } from './parseEvent';
import { validateAccessToken } from '../lib/jwt';

export function parseProtectedEvent(event: APIGatewayProxyEventV2): HttpRequest {
    const baseEvent = parseEvent(event);

    const { authorization } = event.headers || {};
    
    if (!authorization) {
        throw new Error('No authorization header provided');
    }

    const [, token] = authorization.split(' ');

    const userId = validateAccessToken(token);

    if (!userId) {
        throw new Error('Invalid access token');
    }
    
    return {
        ...baseEvent, 
        userId,
    };
}