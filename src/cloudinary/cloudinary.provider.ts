import { v2 } from 'cloudinary';
import { CloudinaryConstants } from 'src/common/constants/constants';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: CloudinaryConstants.CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    return v2.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
  