import { Controller, Post, Body, UseGuards, Get, Param, Delete } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';

@ApiTags('conversations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) { }

    @ApiOperation({ summary: 'Create a new conversation' })
    @ApiResponse({ status: 201, description: 'Conversation created successfully.' })
    @Post()
    async createConversation(
        @GetUser() user: { userId: string },
        @Body() createConversationDto: CreateConversationDto,
    ) {
        return this.conversationsService.createConversation(user.userId, createConversationDto);
    }

    @ApiOperation({ summary: 'Get all user conversations' })
    @ApiResponse({ status: 200, description: 'Conversations retrieved successfully.' })
    @Get()
    async getConversations(@GetUser() user: { userId: string }) {
        return this.conversationsService.getConversations(user.userId);
    }

    @ApiOperation({ summary: 'Get a conversation by id' })
    @ApiResponse({ status: 200, description: 'Conversation retrieved successfully.' })
    @Get(':id')
    async getConversationById(
        @GetUser() user: { userId: string },
        @Param('id') conversationId: string,
    ) {
        return this.conversationsService.getConversationById(user.userId, conversationId);
    }

    @ApiOperation({ summary: 'Delete a conversation' })
    @ApiResponse({ status: 200, description: 'Conversation deleted successfully.' })
    @Delete(':id')
    async deleteConversation(
        @GetUser() user: { userId: string },
        @Param('id') conversationId: string,
    ) {
        return this.conversationsService.deleteConversation(user.userId, conversationId);
    }

    @ApiOperation({ summary: 'Send a message in a conversation' })
    @ApiResponse({ status: 201, description: 'Message sent successfully.' })
    @Post(':id/messages')
    async sendMessage(
        @GetUser() user: { userId: string },
        @Param('id') conversationId: string,
        @Body() createMessageDto: CreateMessageDto,
    ) {
        return this.conversationsService.sendMessage(user.userId, conversationId, createMessageDto);
    }

    @ApiOperation({ summary: 'Get messages from a conversation' })
    @ApiResponse({ status: 200, description: 'Messages retrieved successfully.' })
    @Get(':id/messages')
    async getMessages(
        @GetUser() user: { userId: string },
        @Param('id') conversationId: string,
    ) {
        return this.conversationsService.getMessages(user.userId, conversationId);
    }
}
