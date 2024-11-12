import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBuilding, fetchBuildings } from "../../api/building-api";
import { Box, CircularProgress, Snackbar, Stack } from "@mui/material";
import UpdateBuildingDialog from "./UpdateBuildingDialog";
import CreateBuildingDialog from "./CreateBuildingDialog";
import { useState } from "react";
import { Building } from "./building-interface";
import "./Building.css";
import BuildingCardComponent from "./BuildingCardComponent";

const BuildingComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const { data: buildings, isLoading } = useQuery<Building[]>({
    queryKey: ["buildings"],
    queryFn: fetchBuildings,
  });

  const { mutate: mutateDeleteBuilding } = useMutation({
    mutationFn: (building: Building) => deleteBuilding(building.id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
    onError: (error: any) => {
      setSnackbarMessage(error?.response?.data?.message || "An error occurred");
      setSnackbarOpen(true);
    },
  });

  const handleDialogOpen = (building: Building) => {
    setSelectedBuilding(building);
    setDialogOpen(true);
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
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress size={"10rem"} />
          </Box>
        ) : (
          buildings?.map((building, index) => (
            <BuildingCardComponent
              key={index}
              building={building}
              onEditBuilding={handleDialogOpen}
              onDeleteBuilding={(building) => mutateDeleteBuilding(building)}
            />
          ))
        )}

        {selectedBuilding ? (
          <UpdateBuildingDialog
            building={selectedBuilding}
            open={dialogOpen}
            onClose={handleDialogClose}
          />
        ) : undefined}
      </Stack>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        message={snackbarMessage}
      />
    </>
  );
};

export default BuildingComponent;
