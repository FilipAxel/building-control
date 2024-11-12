import { TemperatureSensor } from "./temperature-sensor-interface";
import "./TemperatureSensor.css";
import { Chip, IconButton, Menu, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import UpdateTemperatureSensorDialog from "./UpdateTemperatureSensorDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTempSensor } from "../../api/temperature-sensor-api";

const TemperatureSensorComponent: React.FC<{
  tempSensor: TemperatureSensor;
}> = ({ tempSensor }) => {
  const queryClient = useQueryClient();
  const [currentTempSensorId, setCurrentTempSensorId] = useState<number | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = Boolean(anchorEl);
  const [selectedTempSensor, setSelectedTempSensor] =
    useState<TemperatureSensor | null>(null);

  const { mutate: mutateDeleteTempSensor } = useMutation({
    mutationFn: (tempSensor: TemperatureSensor) =>
      deleteTempSensor(tempSensor.id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    tempSensorId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentTempSensorId(tempSensorId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentTempSensorId(null);
  };

  const handleDialogOpen = (tempSensor: TemperatureSensor) => {
    setSelectedTempSensor(tempSensor);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTempSensor(null);
  };

  return (
    <>
      <div className="temp-sensor-card">
        <div className="status-name-layout">
          <Chip
            size="small"
            label={` ${tempSensor.isActive ? "Online" : "Offline"}`}
            color={tempSensor.isActive ? "success" : "default"}
          />
          <p>{tempSensor.name},</p>
          <p>Location: {tempSensor.location}</p>

          <div>
            <IconButton
              id={`menu-button-${tempSensor.id}`}
              aria-controls={
                open && currentTempSensorId === tempSensor.id
                  ? `basic-${tempSensor.id}`
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={
                open && currentTempSensorId === tempSensor.id
                  ? "true"
                  : undefined
              }
              onClick={(event) => handleClick(event, tempSensor.id)}
            >
              <EditIcon />
            </IconButton>
            <Menu
              id={`basic-menu-${tempSensor.id}`}
              anchorEl={anchorEl}
              open={open && currentTempSensorId === tempSensor.id}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": `menu-button-${tempSensor.id}`,
              }}
            >
              <MenuItem onClick={() => handleDialogOpen(tempSensor)}>
                Edit Temperature sensor
              </MenuItem>
              <MenuItem
                sx={{ color: "red" }}
                onClick={() => {
                  mutateDeleteTempSensor(tempSensor);
                  handleMenuClose();
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </div>
        </div>
        {tempSensor.isActive ? (
          <p>
            Sensor reading temperature of: <b>{tempSensor.temperature}°C</b>
          </p>
        ) : undefined}
      </div>

      {selectedTempSensor ? (
        <UpdateTemperatureSensorDialog
          tempSensor={selectedTempSensor}
          open={dialogOpen}
          onClose={handleDialogClose}
        />
      ) : undefined}
    </>
  );
};

export default TemperatureSensorComponent;
