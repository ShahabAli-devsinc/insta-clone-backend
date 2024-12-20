import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { Like } from 'src/like/entities/like.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Unique identifier for the post',
    example: 1,
  })
  id: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    description: 'The user who created the post',
    type: () => User,
    example: 1,
  })
  user: User;

  @Column()
  @ApiProperty({
    description: 'ID of the user who created the post',
    example: 1,
  })
  userId: number;

  @Column()
  @ApiProperty({
    description: 'URL of the image associated with the post',
    example: 'https://example.com/image.jpg',
  })
  imageUrl: string;

  @Column()
  @ApiProperty({
    description: 'Caption for the post',
    example: 'A beautiful sunset!',
  })
  caption: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the post was created',
    example: '2024-12-16T14:32:00Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the post was last updated',
    example: '2024-12-16T15:00:00Z',
  })
  updatedAt: Date;

  @OneToMany(() => Like, (like) => like.post)
  @ApiProperty({
    description: 'List of likes for the post',
    type: () => [Like],
  })
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  @ApiProperty({
    description: 'List of comments for the post',
    type: () => [Comment],
  })
  comments: Comment[];
}
