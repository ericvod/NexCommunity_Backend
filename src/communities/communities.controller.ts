import { Controller, Post, Get, Param, Body, UseGuards, Query, Patch, Delete } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { UpdateCommunityDto } from './dto/update-community.dto';

@ApiTags('communities')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) { }

  @ApiOperation({ summary: 'Create a new community' })
  @ApiResponse({ status: 201, description: 'Community created successfully' })
  @Post()
  async createCommunity(
    @GetUser() user: { userId: string },
    @Body() createCommunityDto: CreateCommunityDto, 
  ) {
    return this.communitiesService.createCommunity(user.userId, createCommunityDto);
  }

  @ApiOperation({ summary: 'Get all communities' })
  @ApiResponse({ status: 200, description: 'Communities retrieved successfully.' })
  @Get()
  async getCommunities(@Query() query: any) {
    return this.communitiesService.getCommunities(query);
  }

  @ApiOperation({ summary: 'Get community by id' })
  @ApiResponse({ status: 200, description: 'Community retrieved successfully.' })
  @Get(':id')
  async getCommunityById(@Param('id') communityId: string) {
    return this.communitiesService.getCommunityById(communityId);
  }

  @ApiOperation({ summary: 'Update community' })
  @ApiResponse({ status: 200, description: 'Community updated successfully.' })
  @Patch(':id')
  async updateCommunity(
    @GetUser() user: { userId: string },
    @Param('id') communityId: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    return this.communitiesService.updateCommunity(user.userId, communityId, updateCommunityDto);
  }

  @ApiOperation({ summary: 'Delete community' })
  @ApiResponse({ status: 200, description: 'Community deleted successfully.' })
  @Delete(':id')
  async deleteCommunity(
    @GetUser() user: { userId: string },
    @Param('id') communityId: string,
  ) {
    return this.communitiesService.deleteCommunity(user.userId, communityId);
  }
}
