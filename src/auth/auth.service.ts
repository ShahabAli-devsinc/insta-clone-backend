import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginCredentials } from 'src/common/types/types';
import { JWT_TOKEN_EXPIRATION_TIME } from 'src/common/constants/constants';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly logger: CustomLoggerService,
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

  async login(
    userLoginCredentials: LoginCredentials,
    @Res() response: Response,
  ) {
    try {
      const validatedUser = await this.validateUser(userLoginCredentials);

      const payload: JwtPayload = {
        userId: validatedUser.id,
        username: validatedUser.username,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: JWT_TOKEN_EXPIRATION_TIME,
      });
      // Set the cookie in the response
      response.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: JWT_TOKEN_EXPIRATION_TIME,
      });

      const signedInUser = await this.usersService.findById(validatedUser.id);

      response.json({
        message: 'Logged in successfully',
        user: signedInUser,
      });
    } catch (error) {
      this.logger.error(`Error during login`, error.stack);
      throw new Error(`Error during login.`);
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
