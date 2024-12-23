import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dtos/create-like.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('likes')
@Controller('likes')
@UseGuards(JwtGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Like created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async createLike(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.createLike(createLikeDto);
  }

  @Delete()
  @ApiResponse({ status: 200, description: 'Like removed successfully.' })
  @ApiResponse({ status: 404, description: 'Like not found.' })
  async deleteLike(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.deleteLike(createLikeDto);
  }
}
