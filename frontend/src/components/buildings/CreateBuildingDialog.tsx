import * as React from "react";
import { createBuilding } from "../../api/building-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { CreateBuildingDto } from "./building-interface";

const CreateBuildingDialog = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateCreateBuilding } = useMutation({
    mutationFn: (building: CreateBuildingDto) => createBuilding(building),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      handleClose();
    },
    onError: (error) => {
      console.error("error", error);
    },
  });
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const createdBuilding: CreateBuildingDto = {
      name: formJson.name as string,
      location: formJson.location as string,
    };
    mutateCreateBuilding(createdBuilding);
  };

  return (
    <>
      <Button
        sx={{ height: "50%" }}
        variant="outlined"
        onClick={handleClickOpen}
      >
        Create Building
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) =>
            submitForm(event),
        }}
      >
        <DialogTitle>Create Building</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateBuildingDialog;
