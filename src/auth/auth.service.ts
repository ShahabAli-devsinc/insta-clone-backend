import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service'; // Import the logger
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly logger: CustomLoggerService, // Inject logger service
  ) {}

  async validateUser({ username, password }: LoginDto): Promise<User> {
    try {
      const user = await this.usersService.findOne(username, true);

      if (!user) {
        this.logger.warn(`User not found: ${username}`);
        throw new Error('User not found.');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        this.logger.warn(`Password mismatch for user: ${username}`);
        throw new Error(`Password mismatch for user: ${username}`);
      }

      delete user.password;
      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${username}`, error.stack);
      throw new Error(`Error validating user: ${username}`);
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

      const signedInUser = await this.usersService.findById(user.id);

      response.json({
        message: 'Logged in successfully',
        user: signedInUser,
      });
    } catch (error) {
      this.logger.error(`Error during login for user: ${user.id}`, error.stack);
      throw new Error(`Error during login for user: ${user.id}`);
    }
  }

  async register(body: CreateUserDto): Promise<CreateUserDto> {
    try {
      return await this.usersService.create(body);
    } catch (error) {
      this.logger.error(
        `Error during registration for user: ${body.username}`,
        error,
      );
      throw new Error(`Error during registration for user: ${body.username}`);
    }
  }

  logout(res: Response) {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: false,
      });
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      this.logger.error(`Error during logging out user`, error);
      throw new Error(`Error during logging out user`);
    }
  }
}
