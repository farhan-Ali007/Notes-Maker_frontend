import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import { black, red } from "../../styles/Styled";

const CustomModal = ({
  modalOpen,
  handleClose,
  title,
  message,
  onConfirm,
  confirmButtonText = "Ok",
  cancelButtonText = "Cancel",
  darkMode,
}) => {
  const theme = useTheme();

  return (
    <Dialog open={modalOpen} onClose={handleClose}>
      <DialogContent>
        <p style={{ color: darkMode ? theme.palette.text.primary : black }}>
          {message}
        </p>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-around" }}>
        <Button
          onClick={handleClose}
          color="primary"
          variant="text"
          sx={{
            color: red,
            textTransform: "capitalize",
            borderRadius: "25px",
            padding: "8px 15px 8px 15px",
          }}
        >
          {cancelButtonText}
        </Button>
        <Button
          variant="outlined"
          sx={{
            textTransform: "capitalize",
            borderRadius: "20px",
            padding: "5px 10px",
            color: theme.palette.text.secondary,
            ":hover": {
              background: theme.palette.text.primary,
              color: theme.palette.text.secondary,
            },
          }}
          onClick={() => {
            onConfirm();
            handleClose();
          }}
          color="primary"
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
