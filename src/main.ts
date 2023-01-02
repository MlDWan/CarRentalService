import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          'amqps://quvlodlr:dF96OCG_tvrqDR2j7IofsGU3XCQZSDEM@whale.rmq.cloudamqp.com/quvlodlr',
        ],
        queue: 'new',
        queueOptions: {
          durable: false,
        },
        noAck: false,
      },
    },
  );

  app.listen().then(() => {
    console.log(`Microservice is running...`);
  });
}
bootstrap();
