import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req: any) {
    const organizerId = req.user.sub;
    return this.eventsService.create(createEventDto, organizerId);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.eventsService.findFeatured();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/confirm')
  confirmPresence(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.eventsService.confirmPresence(id, req.user.sub);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
