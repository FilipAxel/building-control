import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { Building } from "./building-interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBuilding } from "../../api/building-api";

interface BuildingDialogProps {
  building: Building;
  open: boolean;
  onClose: () => void;
}

const UpdateBuildingDialog: React.FC<BuildingDialogProps> = ({
  building,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const updateBuildingMutation = useMutation({
    mutationFn: (building: Building) => updateBuilding(building),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      onClose();
    },
    onError: (error) => {
      console.error("error", error);
    },
  });

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const updatedBuilding = {
      ...building,
      name: formJson.name as string,
      location: formJson.location as string,
    };
    updateBuildingMutation.mutate(updatedBuilding);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) =>
          submitForm(event),
      }}
    >
      <DialogTitle>Edit {building.name}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="name"
          fullWidth
          variant="standard"
          defaultValue={building.name}
        />
        <TextField
          required
          margin="dense"
          id="location"
          name="location"
          label="Location"
          type="text"
          fullWidth
          variant="standard"
          defaultValue={building.location}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBuildingDialog;
