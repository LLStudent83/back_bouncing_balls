import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty()
  nickName: string;

  @Column()
  @ApiProperty()
  password: string; // Hashed

  @Column({ nullable: true, unique: true })
  @ApiProperty({ required: false })
  email?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
}