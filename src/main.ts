import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  
  app.enableCors();

  const version = '1.2.0';
  const config = new DocumentBuilder()
    .setTitle('Scrap4Devs Documentation')
    .setDescription(
      `A REST API to retrieve data from 4Devs website by using our scraping service.`
    )
    .setContact('Matheus Muniz Dantas','https://matheusmuniz.dev','matheus.munizera@gmail.com')
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  const port = process.env.PORT || 3000;
  console.log(`Server running on port ${port}`);
  
  await app.listen(port);
}

bootstrap();

 function readChangeLogFileAndGetVersion() {
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const version = changelog.match(/#\D*(.*)/)[1].trim();
return version;
 }