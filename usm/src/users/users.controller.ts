import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { userDto } from './dto/user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Controller() 
export class UsersController {

  constructor(private readonly usersService: UsersService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async create(@Body() createUserDto: userDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'find-user' })
  async findUser(data: any) {
    return await this.usersRepository.findOne({ where: { id: data.userId } });

  }
  @MessagePattern({ cmd: 'update-refresh-token' })
  async updateRefreshToken(data: any) {
    return await this.usersService.updateRefreshToken(data.userId, data.refreshToken);
  }
  @MessagePattern({ cmd: 'find-user-by-id' })
  async findUserByIdWithRefreshToken(userId: any) {
    return await this.usersService.findUserByIdWithRefreshToken(userId);
  }
  @MessagePattern({ cmd: 'find-user-by-email' })
  async findByEmail(email: string) {
    return await this.usersService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'compare-password' })
  async comparePassword(data: any) {
    return await this.usersService.comparePassword(data.plainPassword, data.hashedPasswordFromDb);
  }


}