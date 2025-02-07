import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadedFile } from 'src/common/types/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly logger: CustomLoggerService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const { username, email, password } = dto;

      // Check if username or email already exists
      const existingUser = await this.usersRepository.findOne({
        where: [{ username }, { email }],
      });

      if (existingUser) {
        throw new ConflictException('Username or email already exists.');
      }

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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Unexpected error occurred while creating user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(
    username: string,
    selectPassword?: boolean,
  ): Promise<User | undefined> {
    try {
      return this.usersRepository.findOne({
        where: { username },
        select: {
          id: true,
          username: true,
          email: true,
          password: selectPassword,
        },
      });
    } catch (error) {
      this.logger.error('Error occurred while find user using username', error);
      throw new Error('Error occurred while find user using user');
    }
  }

  async findById(userId: number): Promise<User> {
    try {
      return this.usersRepository.findOneBy({
        id: userId,
      });
    } catch (error) {
      this.logger.error('Error occurred while find user by id', error);
      throw new Error('Error occurred while find user by id');
    }
  }

  async update(userId: number, updateUser: UpdateUserDto, file?: UploadedFile) {
    try {
      const existingUser = await this.findById(userId);
      if (!existingUser) {
        throw new Error('User not found.');
      }

      let userNameExists: boolean;
      if (existingUser && updateUser.username) {
        userNameExists = existingUser.username === updateUser.username;
      }
      if (userNameExists) {
        throw new Error('Username already exists.');
      }

      if (file) {
        const uploadedImage = await this.uploadImageToCloudinary(file);
        updateUser.profilePicture = uploadedImage.secure_url;
      }

      await this.usersRepository.update(userId, updateUser);
      return { id: userId, ...updateUser };
    } catch (error) {
      this.logger.error('Error occurred while updating user profile', error);
      throw new Error('Error occurred while updating user profile');
    }
  }

  async uploadImageToCloudinary(file: UploadedFile) {
    try {
      return await this.cloudinaryService.uploadImage(file);
    } catch (error) {
      throw new BadRequestException('Invalid file type.');
    }
  }

  async findAll(currentUserId: number): Promise<User[]> {
    try {
      return await this.usersRepository.find({
        where: { id: Not(currentUserId) },
        relations: ['posts', 'followers', 'following'],
      });
    } catch (error) {
      this.logger.error('Error occurred while fetching users', error);
      throw new Error('Error occurred while fetching users');
    }
  }
}
