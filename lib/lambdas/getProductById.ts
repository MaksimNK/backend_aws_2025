import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { formatResponse } from "./utils";
import { products } from "./products";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const productId = event.pathParameters?.productId;
        
        if (!productId) {
            return formatResponse(400, {
                error: 'Bad Request',
                message: 'Product ID is required',
            });
        }

        const product = products.find((product) => product.id === productId);
        
        if (!product) {
            return formatResponse(404, {
                error: 'Not found',
                message: `Product with ID ${productId} not found`,
            });
        }

        return formatResponse(200, product);
    } catch (error) {
        return formatResponse(500, {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred',
        });
    }
};
