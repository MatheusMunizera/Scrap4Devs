import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Console } from 'console';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Scrap4Devs Documentation')
    .setDescription(
      `A Rest API to get some data from 4devs website`
    )
    .setContact('Matheus Muniz Dantas','https://matheusmuniz.dev','matheus.munizera@gmail.com')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  const port = process.env.PORT || 3000;
  console.log(`Server running on port ${port}`);
  
  await app.listen(port);
}

bootstrap();