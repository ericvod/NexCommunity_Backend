import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateConversationDto {
    @ApiProperty({ description: 'Conversation is direct or group' })
    @IsBoolean()
    isDirect: boolean;

    @ApiProperty({ description: 'Id of the community if the conversation is group' })
    @IsOptional()
    @IsString()
    communityId: string;

    @ApiProperty({ description: 'Participants of the conversation' })
    @IsArray()
    @IsString({ each: true })
    participants: string[];
}