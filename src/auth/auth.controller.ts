import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    @ApiCreatedResponse({ status: 201, description: 'success' })
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    @ApiOkResponse({ status: 200, description: 'success' })
    signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentialsDto);
    }
}
