import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateUserPassword(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return user;
  }

  async login(user: User) {
    const payload = { 
      email: user.email, 
      sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      },
    };
  }
}
