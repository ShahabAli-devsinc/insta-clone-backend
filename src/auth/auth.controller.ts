import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { LoginValidationGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { LoginUser } from 'src/common/types/types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LoginValidationGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 200,
    description: 'The user has been logged in successfully.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  // async login(@Request() req: Express.Request, @Res() res: Response) {
  async login(@Request() req: Express.Request, @Res() res: Response) {
    const userLoggingIn = req.user as LoginUser;
    this.authService.login(userLoggingIn, res);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been registered successfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout User' })
  @ApiResponse({
    status: 200,
    description: 'User has been logged out successfully.',
  })
  logout(@Res() res: Response) {
    this.authService.logout(res);
  }
}
