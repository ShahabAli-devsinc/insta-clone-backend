import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/posts/entities/post.entity';
import { Follow } from 'src/follow/entities/follow.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  id: number;

  @Column({ unique: true })
  @ApiProperty({
    description: 'Unique username of the user',
    example: 'johndoe',
  })
  username: string;

  @Column({ unique: true })
  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'johndoe@example.com',
  })
  email: string;

  @Column({ select: false })
  @ApiProperty({
    description:
      'Password of the user. This field is not returned in responses.',
    example: 'password123',
    writeOnly: true,
  })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Biography of the user',
    example: 'Software developer from NYC',
    nullable: true,
  })
  bio: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Profile picture URL of the user',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  profilePicture: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2024-12-16T14:32:00Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the user data was last updated',
    example: '2024-12-16T15:00:00Z',
  })
  updatedAt: Date;

  // **New: OneToMany Relationship with Post**
  @OneToMany(() => Post, (post) => post.user)
  @ApiProperty({
    description: 'Posts created by the user',
    type: () => [Post],
    nullable: true,
  })
  posts: Post[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];
}
