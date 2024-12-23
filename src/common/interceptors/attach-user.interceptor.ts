import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { tap, switchMap } from 'rxjs/operators';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AttachUserInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<User> {
    const request = context.switchToHttp().getRequest();

    if (request.user?.userId) {
      return from(this.usersService.findById(request.user.userId)).pipe(
        tap((fullUser) => {
          request.user = fullUser;
        }),
        switchMap(() => next.handle()),
      );
    }

    return next.handle();
  }
}
