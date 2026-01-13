import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'The invitation ID' })
  id: string;

  @ApiProperty({ description: 'The invitation token' })
  token: string;
}
