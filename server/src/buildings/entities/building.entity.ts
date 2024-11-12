import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { TemperatureSensor } from '../../temperature-sensor/entities/temperature-sensor.entity';

@Entity()
export class Building extends AbstractEntity<Building> {
  @Column()
  name: string;

  @Column()
  location: string;

  @OneToMany(
    () => TemperatureSensor,
    (temperatureSensor) => temperatureSensor.building,
    { cascade: true },
  )
  temperatureSensors: TemperatureSensor[];
}
