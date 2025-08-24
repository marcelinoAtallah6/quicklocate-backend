import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { userDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, 
  ) {}

  async create(createUserDto: userDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log("email = ",email)
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined| null>{
    return this.usersRepository.findOne({ where: { id } });
  }

  async comparePassword(plainPassword: string, hashedPasswordFromDb: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPasswordFromDb);
  }

  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`Attempted to update refresh token for non-existent user ID: ${userId}`);
      throw new BadRequestException('User not found.'); // Or handle as an internal error
    }
    const hashedRefreshToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    await this.usersRepository.update(userId, { refreshToken: hashedRefreshToken });
  }

  async findUserByIdWithRefreshToken(userId: number): Promise<User | undefined | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

}