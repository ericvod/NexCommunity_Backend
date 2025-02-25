import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ReactionType } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class CreateReactionDto {
    @ApiProperty({
        description: 'The type of the reaction',
        enum: ReactionType,
    })
    @IsString()
    type: ReactionType;

    @ApiPropertyOptional({ description: 'The id of the post' })
    @IsOptional()
    @IsString()
    postId?: string;

    @ApiPropertyOptional({ description: 'The id of the comment' })
    @IsOptional()
    @IsString()
    commentId?: string;
}