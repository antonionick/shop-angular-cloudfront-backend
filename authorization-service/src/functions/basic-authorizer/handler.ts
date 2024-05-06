import {
  APIGatewayRequestAuthorizerEventV2,
  APIGatewayRequestIAMAuthorizerHandlerV2,
} from 'aws-lambda';

export const basicAuthorizer: APIGatewayRequestIAMAuthorizerHandlerV2 = async (
  event: APIGatewayRequestAuthorizerEventV2,
) => {
  let isAuthorized: boolean;

  try {
    const requestAuthToken = event.headers.authorization.split(' ')[1];
    const authTokenBuffer = Buffer.from(requestAuthToken, 'base64');
    const authToken = authTokenBuffer.toString();
    const [login, password] = authToken.split(':');

    isAuthorized = login === process.env.login && password === process.env.password;
  } catch (err) {
    isAuthorized = false;

    console.error(err);
  } finally {
    return {
      principalId: 'abcdef',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: isAuthorized ? 'Allow' : 'Deny',
            Resource: event.routeArn,
          },
        ],
      },
    };
  }
};
