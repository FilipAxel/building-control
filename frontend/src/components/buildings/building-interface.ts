import { TemperatureSensor } from "../temperature-sensor/temperature-sensor-interface";

export interface Building {
  id: number;
  name: string;
  location: string;
  averageTemp?: number;
  temperatureSensors: TemperatureSensor[];
}
export type CreateBuildingDto = Omit<Building, "id" | "temperatureSensors">;
