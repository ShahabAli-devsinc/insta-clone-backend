import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { Request } from '@nestjs/common';
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
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
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
  async getProfile(@CurrentUser() user: JwtPayload) {
    const currentUser = await this.usersService.findById(user.userId);
    return currentUser;
  }

  @UseGuards(JwtGuard)
  @Patch('update')
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
    @Request() req: Express.Request & { user: JwtPayload },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user.userId;
    const updatedUser = await this.usersService.update(userId, updateUserDto);
    return updatedUser;
  }
}
