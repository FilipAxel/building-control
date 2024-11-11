import { Building } from 'src/buildings/entities/building.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class TemperatureSensor extends AbstractEntity<TemperatureSensor> {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ default: 0 })
  temperature: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Building, (building) => building.temperatureSensors)
  building: Building;
}
