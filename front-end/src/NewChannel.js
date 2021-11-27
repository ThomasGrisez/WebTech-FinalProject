/** @jsxImportSource @emotion/react */

import React from "react";
import { useState, useContext } from "react";
import { useTheme } from "@mui/styles";
import { Typography, TextField, Modal, Grid, Box, Button } from "@mui/material";
import { ReactComponent as ChannelIcon } from "./icons/channel.svg";
import axios from "axios";
import crypto from "crypto";
import Context from "./Context";

const useStyles = (theme) => ({
  root: {
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
    // background: 'rgba(0,0,0,.2)',
  },
  form: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  card: {
    textAlign: "center",
  },
  icon: {
    width: "30%",
    fill: "#fff",
  },
  title: {
    fontSize: 40,
    margin: "0.5em 0 0 0",
    fontWeight: "400",
    color: "white",
  },
  box: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
});

const NewChannel = () => {
  const styles = useStyles(useTheme());

  const { oauth, channels, setChannels } = useContext(Context);
  const [name, setName] = useState("");

  //Handles
  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  //Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Post to create the channel
  const onSubmit = async () => {
    // Post on the back-end's route
    console.log(name);
    const newChannel = { name: name };
    const { data: channelToAdd } = await axios.post(
      `http://localhost:3001/channels/`,
      newChannel
    );
    setChannels([...channels, channelToAdd]);
    // history.push(`/channels/${answer.id}`);
  };

  return (
    <div>
      <ChannelIcon css={styles.icon} onClick={handleOpen} />
      <Typography color="textPrimary" onClick={handleOpen}>
        Create channels
      </Typography>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.box}>
          <div style={{ textAlign: "center", margin: "0 0 0 0" }}>
            <h1 css={styles.title}>Create a new channel</h1>
          </div>
          <form noValidate>
            <Grid container css={styles.form}>
              <TextField
                id="name"
                name="name"
                label="Channel Name"
                variant="outlined"
                fullWidth
                onChange={handleChangeName}
              />
            </Grid>
            <Grid container spacing={1} justify="center">
              <Button
                style={{ margin: "0 auto 0 auto" }}
                type="input"
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </Button>
              <Button
                style={{ margin: "0 auto 0 auto" }}
                type="submit"
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleClose();
                  onSubmit();
                }}
              >
                Create
              </Button>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default NewChannel;
