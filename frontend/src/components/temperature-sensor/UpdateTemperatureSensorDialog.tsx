import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@mui/material";
import { TemperatureSensor } from "./temperature-sensor-interface";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTempSensor } from "../../api/temperature-sensor-api";

interface tempSensorDialogProps {
  tempSensor: TemperatureSensor;
  open: boolean;
  onClose: () => void;
}
const UpdateTemperatureSensorDialog: React.FC<tempSensorDialogProps> = ({
  tempSensor,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(tempSensor.isActive);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const handleIsActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const { mutate: updateTempSensorMutate } = useMutation({
    mutationFn: (tempSensor: TemperatureSensor) => updateTempSensor(tempSensor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      onClose();
    },
    onError: (error: any) => {
      setSnackbarMessage(error?.response?.data?.message || "An error occurred");
      setSnackbarOpen(true);
    },
  });

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const updatedTempSensor = {
      ...tempSensor,
      name: formJson.name as string,
      location: formJson.location as string,
      isActive: checked,
    };
    updateTempSensorMutate(updatedTempSensor);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) =>
            submitForm(event),
        }}
      >
        <DialogTitle>Edit {tempSensor.name}</DialogTitle>
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
            defaultValue={tempSensor.name}
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
            defaultValue={tempSensor.location}
          />
          <FormControlLabel
            control={
              <Checkbox checked={checked} onChange={handleIsActiveChange} />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        message={snackbarMessage}
      />
    </>
  );
};

export default UpdateTemperatureSensorDialog;
