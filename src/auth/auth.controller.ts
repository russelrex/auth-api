import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    return this.authService.login(user);
  }
}
