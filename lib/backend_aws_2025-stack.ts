import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { Construct } from 'constructs';

export class BackendAws2025Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getProductsListLambda = new nodejsLambda.NodejsFunction(this, 'GetProductsListHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, 'lambdas/getProductsList.ts'), 
      bundling: {
        minify: true,
        sourceMap: true,
      }
    });

    const getProductsByIdLambda = new nodejsLambda.NodejsFunction(this, 'GetProductsByIdHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler', 
      entry: path.join(__dirname, 'lambdas/getProductById.ts'),
      bundling: {
        minify: true,
        sourceMap: true,
      }
    });

    const api = new apigateway.RestApi(this, 'ProductsApi', {
      restApiName: 'Products Service',
      deployOptions: {
        stageName: 'dev',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    });

    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsListLambda));

    const productById = products.addResource('{productId}');
    productById.addMethod('GET', new apigateway.LambdaIntegration(getProductsByIdLambda), {
      requestParameters: {
        'method.request.path.id': true,
      }
    });
  }
}
