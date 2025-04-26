import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
// import { doubleCsrfProtection } from './lib/csrf';

const cookieMiddleware = cookieParser();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

  const originPatterns = allowedOrigins.map((origin) => {
    try {
      return new RegExp(origin);
    } catch {
      return origin;
    }
  });

  app.enableCors({ origin: originPatterns });

  app.use(cookieMiddleware);

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
            'validator.swagger.io',
          ],
          styleSrc: [`'self'`, `'unsafe-inline'`],

          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  // app.use(doubleCsrfProtection);
  const config = new DocumentBuilder()
    .setTitle('NS Service')
    .setDescription('A simple service via ns')
    .setVersion('1.0')
    // .addTag('ns')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
