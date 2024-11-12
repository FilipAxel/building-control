import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getAverageBuildingTemperature } from "../../api/temperature-sensor-api";
import CreateTemperatureSensorDialog from "../temperature-sensor/CreateTemperatureSensorDialog";
import TemperatureSensorComponent from "../temperature-sensor/TemperatureSensorComponent";
import { Building } from "./building-interface";

interface BuildingCardComponentProps {
  building: Building;
  onEditBuilding: (building: Building) => void;
  onDeleteBuilding: (building: Building) => void;
}

const BuildingCardComponent: React.FC<BuildingCardComponentProps> = ({
  building,
  onEditBuilding,
  onDeleteBuilding,
}) => {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [averageTemp, setAverageTemp] = useState<number | undefined>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const { mutate: mutateAverageTemp } = useMutation({
    mutationFn: () => getAverageBuildingTemperature(building.id),
    onSuccess: (data) => {
      setAverageTemp(data);
      queryClient.setQueryData(["averageTemp", building.id], data);
    },
    onError: (error: any) => {
      setSnackbarMessage(error?.response?.data?.message || "An error occurred");
      setSnackbarOpen(true);
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Card sx={{ minWidth: 275, padding: "5px" }}>
        <CardContent sx={{ padding: "8px" }}>
          <div id="menu">
            <div>
              <Typography
                gutterBottom
                sx={{ color: "text.primary", fontSize: 18 }}
              >
                {building.name}
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Location: {building.location}
              </Typography>
            </div>
            <div>
              <Button onClick={() => mutateAverageTemp()}>
                Check the building's average temperature
              </Button>
              {averageTemp !== undefined && (
                <p>
                  Average Building Temperature:&nbsp;
                  <b>{averageTemp}°C</b>
                </p>
              )}
            </div>
            <div>
              <IconButton
                aria-controls={anchorEl ? `menu-${building.id}` : undefined}
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                id={`menu-${building.id}`}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => onEditBuilding(building)}>
                  Edit Building
                </MenuItem>
                <MenuItem
                  sx={{ color: "red" }}
                  onClick={() => {
                    onDeleteBuilding(building);
                    handleMenuClose();
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </div>
          </div>

          <div>
            <h3>
              {building.temperatureSensors.length
                ? "Sensors"
                : "No sensors installed"}
            </h3>
            <CreateTemperatureSensorDialog buildingId={building.id} />
          </div>
          {building.temperatureSensors.length ? (
            <div className="temperature-container">
              {building.temperatureSensors.map((tempSensor, index) => (
                <TemperatureSensorComponent
                  tempSensor={tempSensor}
                  key={index}
                />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        message={snackbarMessage}
      />
    </>
  );
};

export default BuildingCardComponent;
