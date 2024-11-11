import { Building } from './building.entity';
import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class TemperatureSensor extends AbstractEntity<TemperatureSensor> {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  temperature: number;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => Building, (building) => building.temperatureSensors)
  building: Building;
}
