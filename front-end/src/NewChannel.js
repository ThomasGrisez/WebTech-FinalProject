/** @jsxImportSource @emotion/react */

import React from "react";
import { useState, useContext } from "react";
import { useTheme } from "@mui/styles";
import { Typography, TextField, Modal, Grid, Box } from "@mui/material";
import ButtonUnstyled, {
  buttonUnstyledClasses,
} from "@mui/core/ButtonUnstyled";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { ReactComponent as ChannelIcon } from "./icons/channel.svg";
import axios from "axios";
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

//Button MUI
const ButtonRoot = React.forwardRef(function ButtonRoot(props, ref) {
  const { children, ...other } = props;

  return (
    <svg width="100" height="50" {...other} ref={ref}>
      <polygon points="0,50 0,0 100,0 100,50" className="bg" />
      <polygon points="0,50 0,0 100,0 100,50" className="borderEffect" />
      <foreignObject x="0" y="0" width="100" height="50">
        <div className="content">{children}</div>
      </foreignObject>
    </svg>
  );
});

ButtonRoot.propTypes = {
  children: PropTypes.node,
};

const CustomButtonRoot = styled(ButtonRoot)(
  ({ theme }) => `
  overflow: visible;
  cursor: pointer;
  --main-color: ${
    theme.palette.mode === "light" ? "rgb(25,118,210)" : "rgb(144,202,249)"
  };
  --hover-color: ${
    theme.palette.mode === "light"
      ? "rgba(25,118,210,0.04)"
      : "rgba(144,202,249,0.08)"
  };
  --active-color: ${
    theme.palette.mode === "light"
      ? "rgba(25,118,210,0.12)"
      : "rgba(144,202,249,0.24)"
  };

  & polygon {
    fill: transparent;
    transition: all 800ms ease;
    pointer-events: none;
  }
  
  & .bg {
    stroke: var(--main-color);
    stroke-width: 0.5;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1));
    fill: transparent;
  }

  & .borderEffect {
    stroke: var(--main-color);
    stroke-width: 2;
    stroke-dasharray: 150 600;
    stroke-dashoffset: 150;
    fill: transparent;
  }

  &:hover,
  &.${buttonUnstyledClasses.focusVisible} {
    .borderEffect {
      stroke-dashoffset: -600;
    }

    .bg {
      fill: var(--hover-color);
    }
  }

  &:focus,
  &.${buttonUnstyledClasses.focusVisible} {
    outline: none;
  }

  &.${buttonUnstyledClasses.active} { 
    & .bg {
      fill: var(--active-color);
      transition: fill 300ms ease-out;
    }
  }

  & foreignObject {
    pointer-events: none;

    & .content {
      font-family: Helvetica, Inter, Arial, sans-serif;
      font-size: 14px;
      font-weight: 200;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--main-color);
      text-transform: uppercase;
    }

    & svg {
      margin: 0 5px;
    }
  }`
);

const SvgButton = React.forwardRef(function SvgButton(props, ref) {
  return <ButtonUnstyled {...props} component={CustomButtonRoot} ref={ref} />;
});

const NewChannel = () => {
  const styles = useStyles(useTheme());

  const { channels, setChannels } = useContext(Context);
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
    const newChannel = { name: name };
    const { data: channelToAdd } = await axios.post(
      `http://localhost:3001/channels/`,
      newChannel
    );
    setChannels([...channels, channelToAdd]);
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
              <SvgButton
                style={{ margin: "0 auto 0 auto" }}
                type="input"
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </SvgButton>
              <SvgButton
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
              </SvgButton>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default NewChannel;
