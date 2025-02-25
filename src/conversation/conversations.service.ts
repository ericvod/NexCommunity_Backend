import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ConversationsService {
    private readonly logger = new Logger(ConversationsService.name);

    constructor(private readonly prisma: PrismaService) { }

    async createConversation(userId: string, createConversationDto: CreateConversationDto) {
        try {
            const conversation = await this.prisma.conversation.create({
                data: {
                    isDirect: createConversationDto.isDirect,
                    community: createConversationDto.communityId ? { connect: { id: createConversationDto.communityId } } : undefined,
                    participants: {
                        create: createConversationDto.participants.map((participantId) => ({
                            user: { connect: { id: participantId } },
                        })),
                    },
                },
            });

            this.logger.log(`User ${userId} created conversation ${conversation.id}`);
            return conversation;
        } catch (error) {
            this.logger.error(`Error creating conversation: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to create conversation');
        }
    }

    async getConversations(userId: string) {
        try {
            const conversations = await this.prisma.conversation.findMany({
                where: {
                    participants: { some: { userId } },
                },
                include: { participants: true, messages: true },
            });

            return conversations;
        } catch (error) {
            this.logger.error(`Error retrieving conversations: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve conversations');
        }
    }

    async getConversationById(userId: string, conversationId: string) {
        try {
            const conversation = await this.prisma.conversation.findUnique({
                where: { id: conversationId },
                include: { participants: true, messages: true },
            });

            if (!conversation) {
                throw new NotFoundException('Conversation not found');
            }

            if (!conversation.participants.some((p) => p.userId === userId)) {
                throw new ForbiddenException('You are not a participant in this conversation');
            }

            return conversation;
        } catch (error) {
            this.logger.error(`Error retrieving conversation ${conversationId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async deleteConversation(userId: string, conversationId: string) {
        try {
            const conversation = await this.prisma.conversation.findUnique({
                where: { id: conversationId },
                include: { participants: true },
            });

            if (!conversation) {
                throw new NotFoundException('Conversation not found');
            }

            if (!conversation.participants.some((p) => p.userId === userId)) {
                throw new ForbiddenException('You are not a participant in this conversation');
            }

            await this.prisma.conversation.delete({ where: { id: conversationId } });

            this.logger.log(`User ${userId} deleted conversation ${conversationId}`);
            return { message: 'Conversation deleted successfully' };
        } catch (error) {
            this.logger.error(`Error deleting conversation ${conversationId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async sendMessage(userId: string, conversationId: string, createMessageDto: CreateMessageDto) {
        try {
            const conversation = await this.prisma.conversation.findUnique({
                where: { id: conversationId },
                include: { participants: true },
            });

            if (!conversation) {
                throw new NotFoundException('Conversation not found');
            }

            if (!conversation.participants.some((p) => p.userId === userId)) {
                throw new ForbiddenException('You are not a participant in this conversation');
            }

            const message = await this.prisma.message.create({
                data: {
                    content: createMessageDto.content,
                    conversation: { connect: { id: conversationId } },
                    author: { connect: { id: userId } },
                },
            });

            this.logger.log(`User ${userId} sent message ${message.id} in conversation ${conversationId}`);
            return message;
        } catch (error) {
            this.logger.error(`Error sending message in conversation ${conversationId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to send message');
        }
    }

    async getMessages(userId: string, conversationId: string) {
        try {
            const conversation = await this.prisma.conversation.findUnique({
                where: { id: conversationId },
                include: { participants: true, messages: true },
            });

            if (!conversation) {
                throw new NotFoundException('Conversation not found');
            }

            if (!conversation.participants.some((p) => p.userId === userId)) {
                throw new ForbiddenException('You are not a participant in this conversation');
            }

            return conversation.messages;
        } catch (error) {
            this.logger.error(`Error retrieving messages for conversation ${conversationId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve messages');
        }
    }
}
