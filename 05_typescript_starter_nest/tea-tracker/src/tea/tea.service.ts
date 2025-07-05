import { Injectable, NotFoundException } from '@nestjs/common';
import { Tea } from './entities/tea.entity';

@Injectable()
export class TeaService {
  private tea: Tea[] = [];

  async getAll(): Promise<Tea[]> {
    return this.tea;
  }

  async getOne(id: number): Promise<Tea> {
    const tea = this.tea.find((i) => i.id === id);
    if (!tea) throw new NotFoundException('Tea not found');
    return tea;
  }

  async create() {}

  async update() {}

  async remove(id: number): Promise<void> {
    this.tea = this.tea.filter((i) => i.id !== id);
  }
}
