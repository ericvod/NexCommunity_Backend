import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ description: 'The email of a user' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The password of a user' })
    @IsString()
    password: string;
}
