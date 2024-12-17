import { Controller, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'The user has been logged in successfully.', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async login(@Request() req: Express.Request, @Res() res: Response) {
    return this.authService.login(req.user, res);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })  // Endpoint summary
  @ApiResponse({ status: 201, description: 'The user has been registered successfully.', type: User })  // Success response
  @ApiResponse({ status: 400, description: 'Bad Request' })  // Error response for invalid data
  @ApiBody({ type: CreateUserDto })  // Document the request body type
  async register(@Body() body: CreateUserDto) {
    const user = await this.authService.register(body);
    return user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout User' })  // Endpoint summary
  @ApiResponse({ status: 200, description: 'User has been logged out successfully.' })  // Success response
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: false,
    });
    return res.json({ message: 'Logged out successfully' });
  }

}
