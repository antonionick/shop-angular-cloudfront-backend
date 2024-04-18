import middy from '@middy/core';
import {
  APIGatewayRequestAuthorizerEventV2,
  APIGatewayRequestSimpleAuthorizerHandlerV2WithContext,
} from 'aws-lambda';

const handler: APIGatewayRequestSimpleAuthorizerHandlerV2WithContext<unknown> = async (
  event: APIGatewayRequestAuthorizerEventV2,
) => {
  const requestAuthToken = event.headers.authorization.split(' ')[1];
  const authTokenBuffer = Buffer.from(requestAuthToken, 'base64');
  const authToken = authTokenBuffer.toString();
  const [login, password] = authToken.split(':');

  const isAuthorized = login === process.env.login && password === process.env.password;

  return {
    isAuthorized,
    context: {},
  };
};

export const basicAuthorizer = middy(handler);
