import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/import-products-file';
import importFileParser from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    httpApi: {
      cors: {
        allowedMethods: ['GET'],
        allowedOrigins: ['http://localhost:4200', 'https://d1f2rhr76fjntk.cloudfront.net'],
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
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
      ImportBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'import-service-bucket-aws-mentoring-program',
          PublicAccessBlockConfiguration: {
            BlockPublicPolicy: false,
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['PUT'],
                AllowedOrigins: ['http://localhost:4200', 'https://d1f2rhr76fjntk.cloudfront.net'],
              },
            ],
          },
        },
      },
      ImportBucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: {
            Ref: 'ImportBucket',
          },
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'AddPublicReadCannedAcl',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject', 's3:PutObject', 's3:PutObjectAcl'],
                Resource: 'arn:aws:s3:::import-service-bucket-aws-mentoring-program/*',
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
