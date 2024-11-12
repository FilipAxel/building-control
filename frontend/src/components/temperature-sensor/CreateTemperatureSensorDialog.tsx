import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import { CreateTemperatureSensorDto } from "./temperature-sensor-interface";
import { createTempSensor } from "../../api/temperature-sensor-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateTemperatureSensorDialog: React.FC<{
  buildingId: number;
}> = ({ buildingId }) => {
  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(true);
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };
  const handleIsActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const { mutate: mutateCreateTempSensor } = useMutation({
    mutationFn: (tempSensor: CreateTemperatureSensorDto) =>
      createTempSensor(tempSensor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      handleDialogClose();
    },
    onError: (error) => {
      console.error("error", error);
    },
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const createdTempSensor: CreateTemperatureSensorDto = {
      name: formJson.name as string,
      location: formJson.location as string,
      isActive: checked,
      buildingId,
    };
    mutateCreateTempSensor(createdTempSensor);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleDialogOpen}>
        Register Sensor
      </Button>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) =>
            onSubmit(event),
        }}
      >
        <DialogTitle>Register Sensor</DialogTitle>
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
          />

          <FormControlLabel
            control={
              <Checkbox checked={checked} onChange={handleIsActiveChange} />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateTemperatureSensorDialog;
