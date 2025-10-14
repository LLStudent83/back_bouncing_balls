import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game_results')
export class GameResult {
  @PrimaryGeneratedColumn()
  id: number;
  // Placeholder: добавим поля позже (e.g., userId, score)
}