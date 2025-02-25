import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus, PostVisibility } from '@prisma/client';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePostDto {
    @ApiPropertyOptional({ description: 'The title of a post' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: 'The content of a post' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ 
        description: 'The status of a post',
        enum: PostStatus
    })
    @IsOptional()
    @IsString()
    status?: PostStatus;

    @ApiPropertyOptional({ 
        description: 'The visibility of a post',
        enum: PostVisibility
    })
    @IsOptional()
    @IsString()
    visibility?: PostVisibility;
}