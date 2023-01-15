import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './helpers/env/env.helper';
import { ScraperController } from './controllers/scraper.controller';
import { ScraperService } from './services/scraper.service';
import { ErrorInterceptor } from './helpers/interceptors/error.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

const envFilePath: string = getEnvPath(`${__dirname}/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [ScraperController],
  providers: [ScraperService,  {
    provide: APP_INTERCEPTOR,
    useClass: ErrorInterceptor
  }]
})
export class AppModule { 
}
