import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'um_user', schema: 'um' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; 

  @Column({ default: 'user' }) 
  role: string;

  @Column({ nullable: true })
  refreshToken?: string; 

}