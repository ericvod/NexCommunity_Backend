import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { CommunityRole } from "@prisma/client";
import { UpdateCommunityDto } from "./dto/update-community.dto";

@Injectable()
export class CommunitiesService {
    private readonly logger = new Logger(CommunitiesService.name);

    constructor(private readonly prisma: PrismaService) { }

    async createCommunity(
        userId: string,
        createCommunityDto: CreateCommunityDto
    ) {
        try {
            const community = await this.prisma.community.create({
                data: {
                    ...createCommunityDto,
                    memberships: {
                        create: {
                            user: { connect: { id: userId } },
                            role: CommunityRole.ADMIN,
                        },
                    },
                },
            });

            this.logger.log(`User ${userId} created community ${community.id}`);
            return community;
        } catch (error) {
            this.logger.error(`Error creating community: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to create community');
        }
    }

    async getCommunities(query: any) {
        try {
            const communities = await this.prisma.community.findMany({
                where: { deletedAt: null },
            });

            return communities;
        } catch (error) {
            this.logger.error(`Error retrieving communities: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve communities');
        }
    }

    async getCommunityById(communityId: string) {
        try {
            const community = await this.prisma.community.findUnique({
                where: { id: communityId }
            });

            if (!community) {
                throw new NotFoundException('Community not found');
            }

            return community;
        } catch (error) {
            this.logger.error(`Error retrieving community ${communityId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async updateCommunity(
        userId: string, 
        communityId: string, 
        updateCommunityDto: UpdateCommunityDto,
    ) {
        try {
            const membership = await this.prisma.membership.findFirst({
                where: { communityId, userId },
            });
            
            if (!membership || (membership.role !== CommunityRole.ADMIN && membership.role !== CommunityRole.MODERATOR)) {
                throw new ForbiddenException('Not allowed to update this community');
            }

            const updatedCommunity = await this.prisma.community.update({
                where: { id: communityId },
                data: updateCommunityDto,
            });

            this.logger.log(`User ${userId} updated community ${communityId}`);
            return updatedCommunity;
        } catch (error) {
            this.logger.error(`Error updating community ${communityId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async deleteCommunity(
        userId: string, 
        communityId: string,
    ) {
        try {
            const membership = await this.prisma.membership.findFirst({
                where: { communityId, userId },
            });

            if (!membership || membership.role !== 'ADMIN') {
                throw new ForbiddenException('Not allowed to delete this community');
            }

            await this.prisma.community.update({ 
                where: { id: communityId },
                data: {
                    deletedAt: new Date()
                }
             });

            this.logger.log(`User ${userId} deleted community ${communityId}`);
            return { message: 'Community deleted successfully' };
        } catch (error) {
            this.logger.error(`Error deleting community ${communityId}: ${error.message}`, error.stack);
            throw error;
        }
    }
}