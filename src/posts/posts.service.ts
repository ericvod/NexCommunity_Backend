import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private readonly prisma: PrismaService) { }

  async createPost(
    userId: string,
    createPostDto: CreatePostDto,
  ) {
    try {
      const postData = {
        title: createPostDto.title,
        content: createPostDto.content,
        status: createPostDto.status,
        visibility: createPostDto.visibility,
        author: { connect: { id: userId } },
        ...(createPostDto.communityId ? { community: { connect: { id: createPostDto.communityId } } } : {}),
      }

      const post = await this.prisma.post.create({
        data: postData,
      });

      this.logger.log(`User ${userId} created post ${post.id}`);

      return post;
    } catch (error) {
      this.logger.error(`Error creating post for user ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create post');
    }
  }


  async getPosts(query: any) {
    try {
      const posts = await this.prisma.post.findMany({
        where: { deletedAt: null }
      })

      return posts;
    } catch (error) {
      this.logger.error(`Error getting posts: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to get posts');
    }
  }

  async getPostById(postId: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      return post;
    } catch (error) {
      this.logger.error(`Error getting post ${postId}: ${error.message}`, error.stack);
      throw error;
    }
  }



  async updatePost(userId: string, postId: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.authorId !== userId) {
        throw new ForbiddenException('You are not allowed to update this post');
      }

      const updatedPost = this.prisma.post.update({
        where: { id: postId },
        data: updatePostDto,
      });

      this.logger.log(`User ${userId} updated post ${postId}`);
      return updatedPost;
    } catch (error) {
      this.logger.error(`Error updating post ${postId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deletePost(userId: string, postId: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.authorId !== userId) {
        throw new ForbiddenException('You are not allowed to delete this post');
      }

      await this.prisma.post.update({
        where: { id: postId },
        data: { deletedAt: new Date() }
      });

      return { message: 'Post deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting post ${postId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
