import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'The name of a user' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'The bio of a user' })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({ description: 'The image of a user' })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional({ description: 'The flag to determine if a user is private' })
    @IsOptional()
    @IsBoolean()
    isPrivate?: boolean;
}