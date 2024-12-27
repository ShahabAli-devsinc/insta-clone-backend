import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  @Delete()
  @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async deleteComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.deleteComment(createCommentDto);
  }
}
