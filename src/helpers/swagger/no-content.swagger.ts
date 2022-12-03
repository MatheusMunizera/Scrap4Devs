import { ApiProperty } from '@nestjs/swagger';

export class NoContentSwagger {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;
}