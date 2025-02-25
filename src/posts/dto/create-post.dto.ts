import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus, PostVisibility } from '@prisma/client';
import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
    @ApiProperty({ description: 'The title of a post' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'The content of a post' })
    @IsString()
    content: string;

    @ApiPropertyOptional({
        description: 'The status of a post',
        enum: PostStatus,
        default: PostStatus.DRAFT
    })
    @IsOptional()
    status?: PostStatus;

    @ApiPropertyOptional({
        description: 'The visibility of a post',
        enum: PostVisibility,
        default: PostVisibility.PUBLIC
    })
    @IsOptional()
    @IsString()
    visibility?: PostVisibility;

    @ApiProperty({ description: 'The community ID of a post' })
    @IsOptional()
    @IsString()
    communityId?: string;
}
