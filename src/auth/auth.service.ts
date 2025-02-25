import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async signup(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.prisma.user.create({
        data: { ...createUserDto, password: hashedPassword },
      });
      this.logger.log(`User ${user.email} registered successfully.`);
      return {
        message: 'User registered successfully!',
        userId: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      };
    } catch (error) {
      this.logger.error(`Error registering user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });
      if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
        this.logger.warn(`Invalid login attempt for email: ${loginDto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);
      this.logger.log(`User ${user.email} logged in successfully.`);
      return { token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Error during login: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to login');
    }
  }

  async updateProfile(getUserId: { userId: string }, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id: getUserId.userId },
        data: updateUserDto,
      });
      this.logger.log(`User ${user.email} updated successfully.`);
      return {
        message: 'User updated successfully!',
        userId: user.id,
      };
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update profile');
    }
  }
}
