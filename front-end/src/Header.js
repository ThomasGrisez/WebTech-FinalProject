/** @jsxImportSource @emotion/react */
import { useContext } from "react";
// Layout
import { useTheme } from "@mui/styles";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import Context from "./Context";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";

const useStyles = (theme) => ({
  header: {
    padding: theme.spacing(1),
    backgroundColor: "rgba(255,255,255,.3)",
    flexShrink: 0,
  },
  headerLogIn: {
    backgroundColor: "red",
  },
  headerLogOut: {
    backgroundColor: "blue",
  },
  menu: {
    [theme.breakpoints.up("sm")]: {
      display: "none !important",
    },
  },
});

export default function Header({ drawerToggleListener }) {
  const styles = useStyles(useTheme());
  const { oauth, setOauth, drawerVisible, setDrawerVisible } =
    useContext(Context);
  const drawerToggle = (e) => {
    setDrawerVisible(!drawerVisible);
  };
  const onClickLogout = (e) => {
    e.stopPropagation();
    setOauth(null);
  };
  return (
    <header css={styles.header}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={drawerToggle}
        css={styles.menu}
      >
        <MenuIcon />
      </IconButton>
      {oauth ? (
        <Grid container direction="row" xs={12}>
          <Grid item xs alignItems="center" />
          <Grid item> {oauth.email}</Grid>

          <Grid container xs>
            <Button
              variant="contained"
              color="secondary"
              endIcon={<LogoutIcon />}
              onClick={onClickLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      ) : (
        <span></span>
      )}
    </header>
  );
}
