import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
    private readonly logger = new Logger(ReactionsService.name);

    constructor(private readonly prisma: PrismaService) { }

    async createReaction(userId: string, createReactionDto: CreateReactionDto) {
        try {
            const reaction = await this.prisma.reaction.create({
                data: {
                    type: createReactionDto.type,
                    user: { connect: { id: userId } },
                    post: createReactionDto.postId ? { connect: { id: createReactionDto.postId } } : undefined,
                    comment: createReactionDto.commentId ? { connect: { id: createReactionDto.commentId } } : undefined,
                },
            });

            this.logger.log(`User ${userId} created reaction ${reaction.id}`);
            return reaction;
        } catch (error) {
            this.logger.error(`Error creating reaction: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to create reaction');
        }
    }

    async deleteReaction(userId: string, reactionId: string) {
        try {
            const reaction = await this.prisma.reaction.findUnique({ where: { id: reactionId } });

            if (!reaction) {
                throw new NotFoundException('Reaction not found');
            }

            if (reaction.userId !== userId) {
                throw new ForbiddenException('Not allowed to delete this reaction');
            }

            await this.prisma.reaction.delete({ where: { id: reactionId } });

            this.logger.log(`User ${userId} deleted reaction ${reactionId}`);
            return { message: 'Reaction deleted successfully' };
        } catch (error) {
            this.logger.error(`Error deleting reaction ${reactionId}: ${error.message}`, error.stack);
            throw error;
        }
    }
}
