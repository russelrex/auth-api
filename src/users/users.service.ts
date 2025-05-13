import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, firstName, lastName } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return newUser.save();
  }

    async findByEmail(email: string): Promise<User | null> {
      return this.userModel.findOne({ email }).exec();
    }

    async validateUserPassword(email: string, plainPassword: string): Promise<User | null> {
      const user = await this.findByEmail(email);
      if (user && await bcrypt.compare(plainPassword, user.password)) {
        return user;
      }
    return null;
  }
}
