import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService } from '../events/events.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Req() req: any) {
    return this.usersService.findOne(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.sub, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/events/confirmed')
  findMyConfirmedEvents(@Req() req: any) {
    return this.eventsService.findConfirmedByUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/events/past')
  findMyPastEvents(@Req() req: any) {
    return this.eventsService.findPastConfirmedByUser(req.user.sub);
  }

  @Get(':id/events')
  findOrganizerEvents(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findByOrganizer(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
