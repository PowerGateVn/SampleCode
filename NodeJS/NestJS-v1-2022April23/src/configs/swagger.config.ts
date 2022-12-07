import { DocumentBuilder } from '@nestjs/swagger';
import { APP_NAME } from 'src/commons/constants/config.constants';

const config = new DocumentBuilder()
  .setTitle(APP_NAME)
  .setDescription(`API for ${APP_NAME}`)
  .setVersion('1.0')
  .addTag(APP_NAME.toLocaleLowerCase())
  .build();

export default config;
