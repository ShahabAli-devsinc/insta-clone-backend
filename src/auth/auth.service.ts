import { Injectable, HttpException, HttpStatus, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
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
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        this.logger.warn(`Password mismatch for user: ${username}`);
        throw new HttpException(
          'Invalid credentials.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      delete user.password;
      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${username}`, error.stack);
      throw new HttpException(
        `Internal server error while validating user.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new HttpException(
        'Login failed. Please check your credentials.',
        HttpStatus.UNAUTHORIZED,
      );
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error during registration. Username might already exist.`,
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        `Error during logout.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
