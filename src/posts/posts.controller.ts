import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Query, Patch } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: { userId: string }
  ) {
    return this.postsService.createPost(user.userId, createPostDto);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'All posts have been successfully found.' })
  @Get()
  async getPosts(@Query() query: any) {
    return this.postsService.getPosts(query);
  }

  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({ status: 200, description: 'The post has been successfully found.' })
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  
  @ApiOperation({ summary: 'Update a post by id' })
  @ApiResponse({ status: 200, description: 'The post has been successfully updated.' })
  @Patch(':id')
  async updatePost(
    @GetUser() user: { userId: string },
    @Param('id') PostId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(user.userId, PostId, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete a post by id' })
  @ApiResponse({ status: 200, description: 'The post has been successfully deleted.' })
  @Delete(':id')
  async deletePost(
    @GetUser() user: { userId: string },
    @Param('id') postId: string,
  ) {
    return this.postsService.deletePost(user.userId, postId);
  }
}
