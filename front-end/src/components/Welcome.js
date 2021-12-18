/** @jsxImportSource @emotion/react */
// Layout
import { useContext, useEffect, useRef } from "react";
import { useTheme } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Link } from "@mui/material";
import { ReactComponent as SettingsIcon } from "../icons/settings.svg";
import NewChannel from "./NewChannel";
import InviteFriends from "./InviteFriends";
import Context from "./Context";
import axios from "axios";

const useStyles = (theme) => ({
  root: {
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
    background: "#E0FBFC",
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
    fill: "#293241",
  },
});

export default function Welcome() {
  const styles = useStyles(useTheme());
  const navigate = useNavigate();
  const { oauth } = useContext(Context);
  const alreadyExists = useRef(false);

  // Create account if does not exist
  useEffect(() => {
    const fetchUser = async () => {
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
        for (let i = 0; i < users.length; i++) {
          if (users[i].email.includes(oauth.email))
            alreadyExists.current = true;
        }

        //If user doesn't exist then we create it
        if (!alreadyExists.current) {
          axios.post(
            "http://localhost:3001/users/",
            {
              username: oauth.name,
              email: oauth.email,
              channels: [],
            },
            {
              headers: {
                Authorization: `Bearer ${oauth.access_token}`,
              },
            }
          );
          alreadyExists.current = true;
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [oauth]);

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
            <InviteFriends />
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
              <Typography color="#293241">Settings</Typography>
            </Link>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
