import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'QuickLocateKey@2025_!ILOVEJESUSCHRISTMYONLYGOD ', 
  signOptions: {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '6h',
  },
  refreshToken: {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '7d',
  },
}));