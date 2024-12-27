import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Caption for the post',
    example: 'A beautiful sunset!',
  })
  caption?: string;
}
