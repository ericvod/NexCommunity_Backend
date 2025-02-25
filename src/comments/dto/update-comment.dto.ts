import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateCommentDto {
    @ApiPropertyOptional({ description: 'The content of a comment' })
    @IsOptional()
    @IsString()
    content?: string;
}