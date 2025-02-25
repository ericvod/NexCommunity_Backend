import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCommunityRequestDto {
    @ApiProperty({ description: 'The type of the community' })
    @IsString()
    type: string;

    @ApiProperty({ description: 'The id of the community' })
    @IsString()
    communityId: string; 
}