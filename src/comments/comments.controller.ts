import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';

@ApiTags('comments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  @Post('posts/:postId/comments')
  async createComment(
    @GetUser() user: { userId: string },
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(user.userId, postId, createCommentDto);
  }

  @ApiOperation({ summary: 'List all comments of a post' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully.' })
  @Get('posts/:postId/comments')
  async getCommentsForPost(
    @Param('postId') postId: string, 
    @Query() query: any,
  ) {
    return this.commentsService.getCommentsForPost(postId, query);
  }

  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully.' })
  @Patch('comments/:id')
  async updateComment(
    @GetUser() user: { userId: string },
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(user.userId, commentId, updateCommentDto);
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
  @Delete('comments/:id')
  async deleteComment(
    @GetUser() user: { userId: string },
    @Param('id') commentId: string,
  ) {
    return this.commentsService.deleteComment(user.userId, commentId);
  }
}
