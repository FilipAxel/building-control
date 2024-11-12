export interface TemperatureSensor {
  id: number;
  name: string;
  location: string;
  temperature: number;
  isActive: boolean;
  buildingId: number;
  createdAt: Date;
  updatedAt: Date;
}
export type CreateTemperatureSensorDto = Omit<
  TemperatureSensor,
  "id" | "createdAt" | "updatedAt" | "temperature"
>;
