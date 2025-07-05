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
import { Tea } from './entities/tea.entity';

@Controller('tea')
export class TeaController {
  constructor(private readonly tea: TeaService) {}

  @Get()
  async getAll(): Promise<Tea[]> {
    return await this.tea.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Tea> {
    return await this.tea.getOne(+id);
  }

  @Post()
  async create() {
    return await this.tea.create();
  }

  @Put(':id')
  async update() {
    return await this.tea.update();
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.tea.remove(+id);
  }
}
