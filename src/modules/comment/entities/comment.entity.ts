import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Unique identifier for the comment',
    example: 1,
  })
  id: number;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  @ApiProperty({
    description: 'The post that was commented on',
    type: () => Post,
    example: 1,
  })
  post: Post;

  @Column()
  @ApiProperty({
    description: 'ID of the post that was commented on',
    example: 1,
  })
  postId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    description: 'The user who commented on the post',
    type: () => User,
    example: 1,
  })
  user: User;

  @Column()
  @ApiProperty({
    description: 'ID of the user who commented on the post',
    example: 1,
  })
  userId: number;

  @Column('text')
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is a great post!',
  })
  content: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the comment was created',
    example: '2024-12-16T14:32:00Z',
  })
  createdAt: Date;
}
