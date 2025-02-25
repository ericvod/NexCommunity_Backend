import { Controller, Post, Body, UseGuards, Delete, Param } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';

@ApiTags('reactions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('reactions')
export class ReactionsController {
    constructor(private readonly reactionsService: ReactionsService) { }

    @ApiOperation({ summary: 'Create a reaction (like/dislike)' })
    @ApiResponse({ status: 201, description: 'Reaction created successfully.' })
    @Post()
    async createReaction(
        @GetUser() user: { userId: string },
        @Body() createReactionDto: CreateReactionDto,
    ) {
        return this.reactionsService.createReaction(user.userId, createReactionDto);
    }

    @ApiOperation({ summary: 'Delete a reaction' })
    @ApiResponse({ status: 200, description: 'Reaction deleted successfully.' })
    @Delete(':id')
    async deleteReaction(
        @GetUser() user: { userId: string },
        @Param('id') reactionId: string,
    ) {
        return this.reactionsService.deleteReaction(user.userId, reactionId);
    }
}
