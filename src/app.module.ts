import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { CommunitiesModule } from './communities/communities.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ConversationsModule } from './conversation/conversations.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    CommunitiesModule,
    ReactionsModule,
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
