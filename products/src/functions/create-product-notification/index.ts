import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.createProductNotification`,
  events: [
    {
      sns: {
        arn: {
          Ref: 'CreateProductTopic',
        },
        topicName: 'CreateProductTopic',
      },
    },
  ],
};
