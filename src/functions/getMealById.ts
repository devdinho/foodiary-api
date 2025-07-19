import {APIGatewayProxyEventV2 } from "aws-lambda";

import { GetMealByIdController } from "../controllers/GetMealByIdController";
import { parseProtectedEvent } from "../utils/parseProtectedEvent";
import { parseResponse } from "../utils/parseResponse";
import { unauthorized } from "../utils/http";

export async function handler(event: APIGatewayProxyEventV2) {
    try {
        const request = parseProtectedEvent(event);
        const response = await GetMealByIdController.handle(request);
        return parseResponse(response);
    } catch (error) {
        return parseResponse(unauthorized({error: 'Invalid Access Token'}));
    }
}