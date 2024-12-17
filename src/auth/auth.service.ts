import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs";
import { LoginDto } from './dto/login.dto';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';  // Import the logger

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly logger: CustomLoggerService,  // Inject logger service
  ) {}

  async validateUser({ username, password }: LoginDto) {
    try {
      const user = await this.usersService.findOne(username, true);

      if (!user) {
        this.logger.warn(`User not found: ${username}`);
        return null;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        this.logger.warn(`Password mismatch for user: ${username}`);
        return null;
      }

      delete user.password;
      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${username}`, error.stack);
      return null;
    }
  }

  async login(user: any, @Res() response: Response) {
    try {
      const payload = { sub: user.id };
      const accessToken = this.jwtService.sign(payload);
  
      // Set the cookie in the response
      response.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false,
      });

      const signedInUser = await this.usersService.findById(user.id)
  
      return response.json({
        message: 'Logged in successfully',
        user: signedInUser,
      });
    } catch (error) {
      this.logger.error(`Error during login for user: ${user.id}`, error.stack);
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
  

  async register(body: CreateUserDto): Promise<CreateUserDto> {
    try {
      const user = await this.usersService.create(body);
      return user;
    } catch (error) {
      this.logger.error(`Error during registration for user: ${body.username}`, error);
    }
  }
}
