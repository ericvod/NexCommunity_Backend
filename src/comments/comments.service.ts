import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    private readonly logger = new Logger(CommentsService.name);

    constructor(private readonly prisma: PrismaService) { }

    async createComment(
        userId: string, postId: string,
        createCommentDto: CreateCommentDto
    ) {
        try {
            const comment = await this.prisma.comment.create({
                data: {
                    content: createCommentDto.content,
                    post: { connect: { id: postId } },
                    author: { connect: { id: userId } },
                    ...(createCommentDto.parentCommentId ? { parentComment: { connect: { id: createCommentDto.parentCommentId } } } : {})
                },
            });

            this.logger.log(`User ${userId} created comment ${comment.id} on post ${postId}`);
            return comment;
        } catch (error) {
            this.logger.error(`Error creating comment for post ${postId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to create comment');
        }
    }

    async getCommentsForPost(
        postId: string, 
        query: any
    ) {
        try {
          const comments = await this.prisma.comment.findMany({
            where: { 
                postId, 
                deletedAt: null 
            },
            orderBy: { createdAt: 'asc' },
          });
          return comments;
        } catch (error) {
          this.logger.error(`Error retrieving comments for post ${postId}: ${error.message}`, error.stack);
          throw new InternalServerErrorException('Failed to retrieve comments');
        }
      }

    async updateComment(
        userId: string,
        commentId: string,
        updateCommentDto: UpdateCommentDto
    ) {
        try {
            const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            if (comment.authorId !== userId) {
                throw new ForbiddenException('Not allowed to update this comment');
            }

            const updatedComment = await this.prisma.comment.update({
                where: { id: commentId },
                data: updateCommentDto,
            });

            this.logger.log(`User ${userId} updated comment ${commentId}`);
            return updatedComment;
        } catch (error) {
            this.logger.error(`Error updating comment ${commentId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async deleteComment(userId: string, commentId: string) {
        try {
            const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            if (comment.authorId !== userId) {
                throw new ForbiddenException('Not allowed to delete this comment');
            }

            await this.prisma.comment.update({
                where: { id: commentId },
                data: { deletedAt: new Date() }
            });

            this.logger.log(`User ${userId} deleted comment ${commentId}`);
            return { message: 'Comment deleted successfully' };
        } catch (error) {
            this.logger.error(`Error deleting comment ${commentId}: ${error.message}`, error.stack);
            throw error;
        }
    }
}
