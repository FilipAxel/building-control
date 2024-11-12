import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBuilding, fetchBuildings } from "../../api/building-api";
import {
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import UpdateBuildingDialog from "./UpdateBuildingDialog";
import CreateBuildingDialog from "./CreateBuildingDialog";
import { useState } from "react";
import { Building } from "./building-interface";
import "./Building.css";
import SettingsIcon from "@mui/icons-material/Settings";
import TemperatureSensorComponent from "../temperature-sensor/TemperatureSensorComponent";
import CreateTemperatureSensorDialog from "../temperature-sensor/CreateTemperatureSensorDialog";

const BuildingComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: buildings } = useQuery<Building[]>({
    queryKey: ["buildings"],
    queryFn: fetchBuildings,
  });
  const { mutate: mutateDeleteBuilding } = useMutation({
    mutationFn: (building: Building) => deleteBuilding(building.id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [currentBuildingId, setCurrentBuildingId] = useState<number | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    buildingId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentBuildingId(buildingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentBuildingId(null);
  };

  const handleDialogOpen = (building: Building) => {
    setSelectedBuilding(building);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBuilding(null);
  };

  return (
    <>
      <div className="title-container">
        <h1>Buildings</h1>
        <CreateBuildingDialog />
      </div>
      <Stack spacing={2}>
        {buildings?.map((building, index) => (
          <Card key={index} sx={{ minWidth: 275, padding: "5px" }}>
            <CardContent sx={{ padding: "8px" }}>
              <div id="menu">
                <Typography
                  gutterBottom
                  sx={{ color: "text.primary", fontSize: 18 }}
                >
                  {building.name}
                </Typography>
                <div>
                  <IconButton
                    id={`building-menu-button-${building.id}`}
                    aria-controls={
                      open && currentBuildingId === building.id
                        ? `basic-${building.id}`
                        : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={
                      open && currentBuildingId === building.id
                        ? "true"
                        : undefined
                    }
                    onClick={(event) => handleClick(event, building.id)}
                  >
                    <SettingsIcon />
                  </IconButton>
                  <Menu
                    id={`basic-menu-${building.id}`}
                    anchorEl={anchorEl}
                    open={open && currentBuildingId === building.id}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      "aria-labelledby": `building-menu-button-${building.id}`,
                    }}
                  >
                    <MenuItem onClick={() => handleDialogOpen(building)}>
                      Edit Building
                    </MenuItem>
                    <MenuItem
                      sx={{ color: "red" }}
                      onClick={() => {
                        mutateDeleteBuilding(building);
                        handleMenuClose();
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </div>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Location: {building.location}
              </Typography>
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
              ) : undefined}
            </CardContent>
          </Card>
        ))}

        {selectedBuilding ? (
          <UpdateBuildingDialog
            building={selectedBuilding}
            open={dialogOpen}
            onClose={handleDialogClose}
          />
        ) : undefined}
      </Stack>
    </>
  );
};

export default BuildingComponent;
