/** @jsxImportSource @emotion/react */
import { React, useContext } from "react";
import { useTheme } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Context from "./Context";
import Gravatar from "react-gravatar";

const useStyles = (theme) => ({
  root: {
    width: "100%",
    heigt: "100%",
    paddingLeft: "10px",
    overflow: "auto",
    scrollBehaviour: "smooth",
    color: "#3D5A80",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    fontSize: 40,
    fontWeight: "400",
  },
  avatar: {
    display: "flex",
    flexDirection: "column",
  },
  avatarPicture: {
    borderRadius: "50%",
  },
  password: {
    display: "flex",
    flexDirection: "column",
    width: "200px",
  },
  check: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  confirmBtn: {
    display: "flex",
    justifyContent: "center",
  },

  content: {
    flex: "1 1 auto",
    "&.MuiTextField-root": {
      marginRight: theme.spacing(1),
      fill: "black",
    },
  },
});

const Settings = () => {
  const styles = useStyles(useTheme());
  const { oauth, notifications, setNotifications, night, setNight } =
    useContext(Context);

  // Handle Switches
  const handleChangeNight = (event) => {
    setNight(event.target.checked);
  };
  const handleChangeNotif = (event) => {
    setNotifications(event.target.checked);
  };

  return (
    <div css={styles.root}>
      <div css={styles.title}>Settings</div>
      <Grid container direction="row" spacing={3}>
        <Grid item xs>
          <div css={styles.informations}>
            <h2>Informations</h2>
            <p>Pseudo : {oauth.name}</p>
            <p>Email : {oauth.email}</p>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.avatar}>
            <h2>Gravatar</h2>
            <Gravatar
              css={styles.avatarPicture}
              email={oauth.email}
              size={100}
            />
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.checkbox}>
            <h2>Day/Night Theme</h2>
            <div css={styles.check}>
              <p>Night Theme</p>
              <Switch
                checked={night}
                onChange={handleChangeNight}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.checkbox}>
            <h2>Notifications</h2>
            <div css={styles.check}>
              <p>Enable/Disable</p>
              <Switch
                checked={notifications}
                onChange={handleChangeNotif}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
