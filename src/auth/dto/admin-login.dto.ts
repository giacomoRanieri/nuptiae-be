import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ description: 'The admin username' })
  username: string;

  @ApiProperty({ description: 'The admin password' })
  password: string;
}
