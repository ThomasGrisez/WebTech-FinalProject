/** @jsxImportSource @emotion/react */
import { useContext } from "react";
// Layout
import { useTheme } from "@mui/styles";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Context from "./Context";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import Gravatar from "react-gravatar";

const useStyles = (theme) => ({
  header: {
    padding: theme.spacing(1),
    backgroundColor: "#293241",
    flexShrink: 0,
    borderBottom: "1px solid black",
  },
  avatarPicture: {
    borderRadius: "50%",
    marginLeft: 10,
    border: "2px solid white",
  },
  nameAvatar: {
    display: "flex",
    alignItems: "center",
  },
  headerLogIn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
        <div css={styles.headerLogIn}>
          <div css={styles.nameAvatar}>
            {oauth.name}
            <Gravatar
              css={styles.avatarPicture}
              email={oauth.email}
              size={30}
            />
          </div>
          <Button
            variant="contained"
            color="neutral"
            endIcon={<LogoutIcon />}
            onClick={onClickLogout}
          >
            Logout
          </Button>
        </div>
      ) : (
        <span></span>
      )}
    </header>
  );
}
