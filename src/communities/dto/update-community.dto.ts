import { ApiPropertyOptional } from "@nestjs/swagger";
import { CommunityVisibility } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class UpdateCommunityDto {
    @ApiPropertyOptional({ description: 'The name of the community' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'The description of the community' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'The visibility of the community',
        enum: CommunityVisibility,
    })
    @IsOptional()
    @IsString()
    visibility?: CommunityVisibility;
}