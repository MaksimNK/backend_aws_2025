import {APIGatewayProxyResult } from "aws-lambda"
import { formatResponse } from "./utils"
import { products } from "./products"

export const handler = async (): Promise<APIGatewayProxyResult> => {
    try {
        return formatResponse(200, products);
    } catch (error) {
        return formatResponse(500, {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred',
        });
    }
}
