import { HttpException, HttpStatus } from '@nestjs/common';

export function handleErrorThrow(
  error,
  message: string,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
) {
  if (error instanceof HttpException) {
    throw error;
  }
  throw new HttpException(message, status);
}
