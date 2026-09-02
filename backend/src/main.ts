import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // En-têtes de sécurité HTTP (protection XSS, sniffing, clickjacking...)
  app.use(helmet());

  // CORS restreint aux origines explicitement autorisées (jamais '*' pour
  // une plateforme qui manipule de l'argent).
  const allowedOrigins = configService.get<string[]>(
    'security.allowedOrigins',
  );
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('port') ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 API démarrée sur http://localhost:${port}/api/v1`);
}
bootstrap();
