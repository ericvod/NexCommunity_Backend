import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";


export class CreateUserDto {
    @ApiProperty({ description: 'The email of a user' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The password of a user' })
    @IsString()
    @MinLength(8, { message: 'The password must be at least 8 characters long' })
    password: string;

    @ApiProperty({ description: 'The name of a user' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'The username of a user' })
    @IsString()
    username: string;
}   

