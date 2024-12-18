import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const { username, email, password } = dto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
        email,
      });

      const newUser = await this.usersRepository.save(user);
      delete newUser.password;

      return newUser;
    } catch (error) {
      this.logger.error('Error occured while creating user', error);
      throw new Error('Error occurred while creating user');
    }
  }

  async findOne(
    username: string,
    selectPassword?: boolean,
  ): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        password: selectPassword,
      },
    });
  }

  async findById(userId: number): Promise<User> {
    return this.usersRepository.findOneBy({
      id: userId,
    });
  }

  async update(userId: number, updateUser: UpdateUserDto) {
    try {
      const existingUser = await this.findById(userId);
      if (!existingUser) {
        return { message: 'User not found' };
      }

      let userNameExists: boolean;
      if (existingUser && updateUser.username) {
        userNameExists = existingUser.username === updateUser.username;
      }
      if (userNameExists) {
        return { message: 'Username is already taken' };
      }

      // Update fields
      if (updateUser.username) existingUser.username = updateUser.username;
      if (updateUser.bio) existingUser.bio = updateUser.bio;
      if (updateUser.profilePicture)
        existingUser.profilePicture = updateUser.profilePicture;

      // Save the updated user
      await this.usersRepository.save(existingUser);
      return existingUser;
    } catch (error) {
      this.logger.error('Error occurred while updating user profile', error);
      throw new Error('Error occurred while updating user profile');
    }
  }
}
