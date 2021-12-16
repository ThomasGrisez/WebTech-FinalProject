/** @jsxImportSource @emotion/react */
// Layout
import { useContext, useEffect } from "react";
import { useTheme } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Link } from "@mui/material";
import { ReactComponent as FriendsIcon } from "./icons/friends.svg";
import { ReactComponent as SettingsIcon } from "./icons/settings.svg";
import NewChannel from "./NewChannel";
import Context from "./Context";
import axios from "axios";

const useStyles = (theme) => ({
  root: {
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
  },
  card: {
    textAlign: "center",
    "&:hover": {
      borderRadius: "5px",
      background: "rgba(0,0,0,.2)",
    },
  },
  icon: {
    width: "30%",
    fill: "#fff",
  },
});

export default function Welcome() {
  const styles = useStyles(useTheme());
  const navigate = useNavigate();
  const { oauth } = useContext(Context);

  // Create account if does not exist
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: users } = await axios.get(
          `http://localhost:3001/users/`,
          {
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          }
        );

        console.log(users);
        const user = users.find((user) => user.email === oauth.email);
        if (!user) {
          console.log("Create user");
          axios.post(
            "http://localhost:3001/users/",
            {
              username: oauth.name,
              email: oauth.email,
            },
            {
              headers: {
                Authorization: `Bearer ${oauth.access_token}`,
              },
            }
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  });

  return (
    <div css={styles.root}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item xs>
          <div css={styles.card}>
            <NewChannel />
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
            <FriendsIcon css={styles.icon} />
            <Typography color="textPrimary">Invite friends</Typography>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
            <Link
              underline="none"
              href={`settings`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`settings`);
              }}
              style={{ color: "white" }}
            >
              <SettingsIcon css={styles.icon} />
              <Typography color="textPrimary">Settings</Typography>
            </Link>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
