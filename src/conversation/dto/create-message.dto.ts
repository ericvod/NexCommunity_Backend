import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateMessageDto {
    @ApiProperty({ description: 'Content of the message' })
    @IsString()
    content: string;
}