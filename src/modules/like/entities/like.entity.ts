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
export class Like {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Unique identifier for the like',
    example: 1,
  })
  id: number;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  @ApiProperty({
    description: 'The post that was liked',
    type: () => Post,
    example: 1,
  })
  post: Post;

  @Column()
  @ApiProperty({
    description: 'ID of the post that was liked',
    example: 1,
  })
  postId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    description: 'The user who liked the post',
    type: () => User,
    example: 1,
  })
  user: User;

  @Column()
  @ApiProperty({
    description: 'ID of the user who liked the post',
    example: 1,
  })
  userId: number;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the like was created',
    example: '2024-12-16T14:32:00Z',
  })
  createdAt: Date;
}
