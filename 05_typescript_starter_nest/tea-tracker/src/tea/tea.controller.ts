import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TeaService } from './tea.service';
import { Tea, TeaSchema } from './schemas/tea.schema';
import { ZBody } from 'src/decorators/z-body.decorator';
import { CreateTeaDto } from './dto/create-tea.dto';
import { UpdateTeaDto } from './dto/update-tea.dto';

@Controller('tea')
export class TeaController {
  constructor(private readonly tea: TeaService) {}

  @Get()
  async getAll(): Promise<Tea[]> {
    return await this.tea.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Tea> {
    return await this.tea.getOne(id);
  }

  @Post()
  async create(@ZBody(TeaSchema) dto: CreateTeaDto) {
    return await this.tea.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @ZBody(TeaSchema) dto: UpdateTeaDto) {
    return await this.tea.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.tea.remove(id);
  }
}
