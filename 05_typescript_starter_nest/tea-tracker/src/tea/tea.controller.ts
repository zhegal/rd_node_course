import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TeaService } from './tea.service';
import { Tea, TeaSchema } from './schemas/tea.schema';
import { ZBody } from 'src/decorators/z-body.decorator';
import { CreateTeaDto } from './dto/create-tea.dto';
import { UpdateTeaDto } from './dto/update-tea.dto';
import { Pagination } from 'src/types/pagination.type';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBody } from '@nestjs/swagger';

@SkipThrottle()
@Controller('tea')
export class TeaController {
  constructor(private readonly tea: TeaService) {}

  @Get()
  async getAll(
    @Query('minRating', new DefaultValuePipe(0), ParseIntPipe)
    minRating: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<Pagination<Tea>> {
    return await this.tea.getAll(minRating, page, pageSize);
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Tea> {
    return await this.tea.getOne(id);
  }

  @Post()
  @ApiBody({ type: CreateTeaDto })
  @SkipThrottle({ default: false })
  async create(@ZBody(TeaSchema) dto: CreateTeaDto) {
    return await this.tea.create(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateTeaDto })
  async update(@Param('id') id: string, @ZBody(TeaSchema) dto: UpdateTeaDto) {
    return await this.tea.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.tea.remove(id);
  }
}
