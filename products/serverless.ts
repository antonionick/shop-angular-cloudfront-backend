import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/get-products-list';
import getProductsById from '@functions/get-products-by-id';
import createProduct from '@functions/create-product';
import catalogBatchProcess from '@functions/catalog-batch-process';

const serverlessConfiguration: AWS = {
  service: 'shop-angular-cloudfront-backend',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    stage: 'dev',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    httpApi: {
      cors: {
        allowedMethods: ['GET', 'POST'],
        allowedOrigins: ['http://localhost:4200', 'https://d1f2rhr76fjntk.cloudfront.net'],
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamManagedPolicies: [
      'arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess',
      'arn:aws:iam::aws:policy/AWSLambda_FullAccess',
    ],
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Products',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Stocks',
          AttributeDefinitions: [
            {
              AttributeName: 'product_id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'product_id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-item-queue',
        },
      },
      CatalogItemsQueuePolicy: {
        Type: 'AWS::SQS::QueuePolicy',
        Properties: {
          Queues: [{ Ref: 'CatalogItemsQueue' }],
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'Allow-User-SendMessage',
                Effect: 'Allow',
                Principal: '*',
                Action: ['sqs:SendMessage'],
                Resource: 'arn:aws:sqs:eu-central-1:058264190345:catalog-item-queue',
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
