/** @jsxImportSource @emotion/react */
import { React, useContext } from "react";
import { useTheme } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Context from "./Context";
import Gravatar from "react-gravatar";

const useStyles = (theme) => ({
  root: {
    width: "100%",
    heigt: "100%",
    paddingLeft: "10px",
    overflow: "auto",
    scrollBehaviour: "smooth",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    fontSize: 40,
    fontWeight: "400",
  },
  informations: {
    // backgroundColor: "red",
  },
  avatar: {
    display: "flex",
    flexDirection: "column",
    // backgroundColor: "green",
  },
  avatarPicture: {
    borderRadius: "50%",
  },
  password: {
    display: "flex",
    flexDirection: "column",
    width: "200px",
    // backgroundColor: "blue",
  },
  checkbox: {
    // backgroundColor: "yellow",
  },
  check: {
    display: "flex",
    flexDirection: "row",
  },
  confirmBtn: {
    display: "flex",
    justifyContent: "center",
  },
});

const Settings = () => {
  const styles = useStyles(useTheme());
  const { oauth } = useContext(Context);
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
          <div css={styles.password}>
            <h2>Password</h2>
            <div>
              <TextField
                variant="outlined"
                label="Password"
                style={{ marginBottom: "10px" }}
                fullWidth
              />
              <TextField
                variant="outlined"
                label="Confirm Password"
                style={{ marginBottom: "10px" }}
                fullWidth
              />
              <Button variant="outlined">Confirm</Button>
            </div>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.checkbox}>
            <h2>Notifications</h2>
            <div css={styles.check}>
              <p>Enable/Disable</p>
              <Checkbox />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
