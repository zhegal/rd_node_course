import { Injectable, NotFoundException } from '@nestjs/common';
import { Tea } from './schemas/tea.schema';
import { CreateTeaDto } from './dto/create-tea.dto';
import { UpdateTeaDto } from './dto/update-tea.dto';

@Injectable()
export class TeaService {
  private tea: Map<string, Tea> = new Map();

  async getAll(): Promise<Tea[]> {
    return Array.from(this.tea.values());
  }

  async getOne(id: string): Promise<Tea> {
    const tea = this.tea.get(id);
    if (!tea) throw new NotFoundException('Tea not found');
    return tea;
  }

  async create(dto: CreateTeaDto): Promise<Tea> {
    const id = Date.now().toString();
    const created = {
      id,
      ...dto,
    };
    this.tea.set(id, created);
    return created;
  }

  async update(id: string, dto: UpdateTeaDto): Promise<Tea> {
    const tea = this.tea.get(id);
    if (!tea) throw new NotFoundException('Tea not found');
    const updated = {
      ...tea,
      ...dto,
    };
    this.tea.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.tea.delete(id);
  }
}
