import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({ description: 'The content of a comment' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: 'The id of the user who created the comment' })
    @IsOptional()
    @IsString()
    parentCommentId?: string;
}