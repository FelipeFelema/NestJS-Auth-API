import { Controller, Post, Req, Body, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login') 
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Post('register')
      @HttpCode(HttpStatus.CREATED)
      create(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
      }
    
    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    refresh(@Body('refreshToken') refreshToken: string) {
      return this.authService.refreshToken(refreshToken);
    }
}
