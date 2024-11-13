import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Slider,
  AccordionSummary,
  Accordion,
  AccordionDetails,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  adjustTemperature,
  getAverageBuildingTemperature,
} from "../../api/temperature-sensor-api";
import CreateTemperatureSensorDialog from "../temperature-sensor/CreateTemperatureSensorDialog";
import TemperatureSensorComponent from "../temperature-sensor/TemperatureSensorComponent";
import { Building } from "./building-interface";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface BuildingCardComponentProps {
  building: Building;
  onEditBuilding: (building: Building) => void;
  onDeleteBuilding: (building: Building) => void;
}

const marks = [
  { value: 19, label: "19°C" },
  { value: 20, label: "20°C" },
  { value: 21, label: "21°C" },
  { value: 22, label: "22°C" },
  { value: 23, label: "23°C" },
  { value: 24, label: "24°C" },
  { value: 25, label: "25°C" },
];

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
  const [sliderValue, setSliderValue] = useState<number>(averageTemp || 20);

  const { mutate: mutateAverageTemp } = useMutation({
    mutationFn: () => getAverageBuildingTemperature(building.id),
    onSuccess: (data) => {
      setAverageTemp(data);
      setSliderValue(data);
      queryClient.setQueryData(["averageTemp", building.id], data);
    },
    onError: (error: any) => {
      setSnackbarMessage(error?.response?.data?.message || "An error occurred");
      setSnackbarOpen(true);
    },
  });

  const { mutate: mutateAdjustTemperature } = useMutation({
    mutationFn: (amount: number) => adjustTemperature(building.id, amount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      if (averageTemp) {
        setAverageTemp(data.amount);
      }
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

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  const handleSliderCommit = () => {
    mutateAdjustTemperature(sliderValue);
  };

  const valuetext = (value: number) => {
    return `${value}°C`;
  };

  return (
    <>
      <Card sx={{ minWidth: 275, padding: "5px" }}>
        <CardContent sx={{ padding: "8px" }}>
          <div className="menu-container">
            <div className="menu-flex">
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
            <Accordion disabled={!building.temperatureSensors.length}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Adjust temperature
              </AccordionSummary>
              <AccordionDetails>
                <Slider
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  aria-label="Temperature"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  onChangeCommitted={handleSliderCommit}
                  getAriaValueText={valuetext}
                  step={1}
                  min={19}
                  max={25}
                  marks={marks}
                  valueLabelDisplay="auto"
                />
                .
              </AccordionDetails>
            </Accordion>
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
