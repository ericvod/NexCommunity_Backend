import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get the start message' })
  @ApiResponse({ status: 200, description: 'The start message has been successfully found.'})
  @Get()
  getStart(): string {
    return this.appService.getStart();
  }
}
