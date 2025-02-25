import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommunityVisibility } from '@prisma/client';
import { IsString, IsOptional } from 'class-validator';

export class CreateCommunityDto {
  @ApiProperty({ description: 'The name of the community' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'The description of the community' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The visibility of the community',
    enum: CommunityVisibility,
    default: CommunityVisibility.PUBLIC,
  })
  @IsString()
  visibility: CommunityVisibility;
}