import { Injectable, UnauthorizedException, Logger, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SERVICE } from 'src/common/constants/microservies';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(SERVICE.USER_SERVICE) private readonly client: ClientProxy,

  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await lastValueFrom(this.client.send({ cmd: 'find-user-by-email' }, email));
  if (!user) {
      return null;
    }
    const data = {
      plainPassword: pass,
      hashedPasswordFromDb: user.password
    }

    const passwordsMatch = await lastValueFrom(this.client.send({ cmd: 'compare-password' }, data));

    if (passwordsMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.signOptions.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.refreshToken.expiresIn'),
    });

    const data :any = {
      userId: user.id,
      refreshToken: refreshToken
    }

    await this.client.send({ cmd: 'update-refresh-token' }, data);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(userId: number) {
    const data = {
      userId: userId,
      refreshToken: null,
    };
    await this.client.send({ cmd: 'update-refresh-token' }, data);
    this.logger.log(`User ${userId} logged out. Refresh token revoked.`);
  }

  async refreshTokens(userId: number, currentRefreshToken: string) {
    const user = await lastValueFrom(this.client.send({ cmd: 'find-user-by-id' }, userId));
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const isRefreshTokenValid = await bcrypt.compare(currentRefreshToken, user.refreshToken);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const newAccessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.signOptions.expiresIn'),
    });

    const newRefreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.refreshToken.expiresIn'),
    });


    const data = {
      userId: userId,
      refreshToken: newRefreshToken
    }

    await this.client.send('update-refresh-token', data);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
}