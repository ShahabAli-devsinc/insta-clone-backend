import { Module } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';

@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],  // Export for use in other modules
})
export class LoggerModule {}
