import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  follower: User;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  following: User;

  @CreateDateColumn()
  followedAt: Date;
}
