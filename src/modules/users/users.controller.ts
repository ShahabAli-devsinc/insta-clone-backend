import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile as UploadedFileEntity } from 'src/common/types/types';
@ApiTags('Users')
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the profile of the currently authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'The profile of the user has been retrieved successfully.',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is missing or invalid.',
  })
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Patch('update')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update User Profile' })
  @ApiResponse({
    status: 200,
    description: 'The user profile has been updated successfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @CurrentUser() user: User,
    @UploadedFile() file: UploadedFileEntity | undefined,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto, file);
  }

  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch all users except the currently authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users except the current user',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is missing or invalid.',
  })
  async getAllUsers(@CurrentUser() user: User) {
    return this.usersService.findAll(user.id);
  }
}
