export interface Building {
  id: number;
  name: string;
  location: string;
}
export type CreateBuildingDto = Omit<Building, "id">;
