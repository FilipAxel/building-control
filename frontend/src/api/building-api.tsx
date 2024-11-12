import axios from "axios";
import {
  Building,
  CreateBuildingDto,
} from "../components/buildings/building-interface";

export const fetchBuildings = async (): Promise<Building[]> => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/buildings`
  );
  return data;
};

export const createBuilding = async (building: CreateBuildingDto) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/buildings`,
    building,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const updateBuilding = async (building: Building) => {
  const { data } = await axios.patch(
    `${process.env.REACT_APP_API_URL}/buildings/${building.id}`,
    building,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const deleteBuilding = async (buildingId: number) => {
  const { data } = await axios.delete(
    `${process.env.REACT_APP_API_URL}/buildings/${buildingId}`
  );
  return data;
};
