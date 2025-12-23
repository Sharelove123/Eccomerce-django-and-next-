import { SnackbarCloseReason, Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect } from "react";

interface stateInterface{
    open: boolean;
    setOpen: (open: boolean) => void;
    msg: string;
}

const SimpleSnackbar : React.FC<stateInterface> = ({ open, setOpen,msg }) => {
  
    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (
      event: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason,
    ) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

  
    const action = (
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );
  
    return (
      <div>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={msg}
          action={action}
        />
      </div>
    );
  }

export default SimpleSnackbar;