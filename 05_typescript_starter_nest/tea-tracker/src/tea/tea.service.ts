import { Injectable, NotFoundException } from '@nestjs/common';
import { Tea } from './schemas/tea.schema';
import { CreateTeaDto } from './dto/create-tea.dto';
import { UpdateTeaDto } from './dto/update-tea.dto';
import { Pagination } from 'src/types/pagination.type';

@Injectable()
export class TeaService {
  private tea: Map<string, Tea> = new Map();

  async getAll(
    minRating?: number,
    page = 1,
    pageSize = 10,
  ): Promise<Pagination<Tea>> {
    const allItems = Array.from(this.tea.values());

    const filteredItems =
      typeof minRating === 'number'
        ? allItems.filter((tea) => (tea.rating ?? 0) >= minRating)
        : allItems;

    const total = filteredItems.length;
    const offset = (page - 1) * pageSize;
    const data = filteredItems.slice(offset, offset + pageSize);

    return { data, total, page, pageSize };
  }

  async getOne(id: string): Promise<Tea> {
    const tea = this.tea.get(id);
    if (!tea) throw new NotFoundException('Tea not found');
    return tea;
  }

  async create(dto: CreateTeaDto): Promise<Tea> {
    const id = Date.now().toString();
    const created = { id, ...dto };
    this.tea.set(id, created);
    return created;
  }

  async update(id: string, dto: UpdateTeaDto): Promise<Tea> {
    const tea = this.tea.get(id);
    if (!tea) throw new NotFoundException('Tea not found');
    const updated = { ...tea, ...dto };
    this.tea.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const tea = this.tea.get(id);
    if (!tea) throw new NotFoundException('Tea not found');
    this.tea.delete(id);
  }
}
