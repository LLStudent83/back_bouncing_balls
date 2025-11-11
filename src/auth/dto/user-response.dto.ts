import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nickName: string;

  @ApiProperty({ required: false })
  email?: string;
}

export class AuthStatusDto {
  @ApiProperty()
  status: 'authenticated' | 'token_expired' | 'not_registered';

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  user?: UserResponseDto;
}