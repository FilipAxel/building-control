import axios from "axios";
import {
  CreateTemperatureSensorDto,
  TemperatureSensor,
} from "../components/temperature-sensor/temperature-sensor-interface";

export const createTempSensor = async (
  tempSensor: CreateTemperatureSensorDto
) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/temperature-sensor`,
    tempSensor,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const updateTempSensor = async (tempSensor: TemperatureSensor) => {
  const { data } = await axios.patch(
    `${process.env.REACT_APP_API_URL}/temperature-sensor/${tempSensor.id}`,
    tempSensor,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const deleteTempSensor = async (tempSensorId: number) => {
  const { data } = await axios.delete(
    `${process.env.REACT_APP_API_URL}/temperature-sensor/${tempSensorId}`
  );
  return data;
};
