/** @jsxImportSource @emotion/react */

import React from "react";
import { useState, useContext, useEffect } from "react";
import { useTheme } from "@mui/styles";
import {
  Typography,
  TextField,
  Modal,
  Box,
  FormControl,
  Autocomplete,
} from "@mui/material";
import ButtonUnstyled, {
  buttonUnstyledClasses,
} from "@mui/core/ButtonUnstyled";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { ReactComponent as FriendsIcon } from "../icons/friends.svg";
import axios from "axios";
import Context from "./Context";

const useStyles = (theme) => ({
  root: {
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
  },
  card: {
    textAlign: "center",
  },
  icon: {
    width: "30%",
    fill: "#293241",
  },
  title: {
    fontSize: 40,
    fontWeight: "400",
    color: "white",
    margin: "0 0",
    textAlign: "center",
  },
  secondTitle: {
    fontSize: 30,
    fontWeight: "400",
    color: "white",
    textAlign: "center",
    margin: "10px 0",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#3D5A80",
    border: "2px solid #293241",
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  },
  selectChannel: {
    display: "flex",
    flexDirection: "column",
  },
  addFriends: {},
  buttons: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px",
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
  const { oauth, channels } = useContext(Context);

  //Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Add friends
  const [allUsers, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendToAdd, setfriendToAdd] = useState("");
  const handleChangeAutocomplete = (e, value) => {
    setFriends(value);
  };
  const handleChangeTextAutocomplete = (e) => {
    setfriendToAdd(e.target.value);
  };

  // Select channel
  const [value, setValue] = React.useState(channels[0]);

  //Get the friends to add
  useEffect(() => {
    const fetch = async () => {
      try {
        //Fetch all users
        const { data: users } = await axios.get(
          `http://localhost:3001/users/`,
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          }
        );
        setUsers(users);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [oauth.access_token]);

  // Invite to channel
  const onSubmit = async () => {
    // create array of friends Ids to invite
    let friendsID = [];
    friends.forEach((friend) => {
      friendsID.push(friend.id);
    });

    await axios.post(`http://localhost:3001/channelinvite/` + value.id, {
      friends: friendsID,
      headers: {
        Authorization: `Bearer ${oauth.access_token}`,
      },
    });
  };
  return (
    <div>
      <FriendsIcon css={styles.icon} onClick={handleOpen} />
      <Typography color="#293241" onClick={handleOpen}>
        Invite Friends
      </Typography>
      <Modal open={open}>
        <Box sx={styles.box}>
          <p css={styles.title}>Invite Friends</p>
          <div css={styles.selectChannel}>
            <p css={styles.secondTitle}>Wich Channel ?</p>
            <FormControl variant="filled" fullWidth>
              <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                id="channels"
                options={channels}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    label="Select a Channel"
                  />
                )}
              />
            </FormControl>
          </div>
          <div css={styles.addFriends}>
            <p css={styles.secondTitle}>Wich friends ?</p>
            <FormControl variant="filled" fullWidth>
              <Autocomplete
                multiple
                id="friends"
                value={friends}
                options={allUsers}
                getOptionLabel={(option) => option.username}
                onChange={handleChangeAutocomplete}
                style={{ textAlign: "left" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    value={friendToAdd}
                    onChange={handleChangeTextAutocomplete}
                    label="Choose friends to invite"
                    variant="outlined"
                  />
                )}
              />
            </FormControl>
          </div>

          <div css={styles.buttons}>
            <SvgButton
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
              variant="contained"
              color="secondary"
              onClick={() => {
                handleClose();
                onSubmit();
              }}
            >
              Invite
            </SvgButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default NewChannel;
