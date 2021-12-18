/** @jsxImportSource @emotion/react */
import { useContext } from "react";
// Layout
import { useTheme } from "@mui/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Drawer } from "@mui/material";
// Local
import Context from "./Context";
import Channels from "./Channels";
import Channel from "./Channel";
import Welcome from "./Welcome";
import Settings from "./Settings";
import { Route, Routes } from "react-router-dom";

const useStyles = (theme) => ({
  root: {
    backgroundColor: "#E0FBFC",
    overflow: "hidden",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "row",
    position: "relative",
  },
  drawer: {
    width: "200px",
    display: "none",
    backgroundColor: "#293241",
  },
  drawerVisible: {
    display: "block",
    backgroundColor: "#293241",
  },
});

export default function Main() {
  const {
    // currentChannel, not yet used
    drawerVisible,
  } = useContext(Context);

  const theme = useTheme();
  const styles = useStyles(theme);
  const alwaysOpen = useMediaQuery(theme.breakpoints.up("sm"));
  const isDrawerVisible = alwaysOpen || drawerVisible;
  return (
    <main css={styles.root}>
      <Drawer
        PaperProps={{
          style: { position: "relative", backgroundColor: "#293241" },
        }}
        BackdropProps={{
          style: { position: "relative", backgroundColor: "#293241" },
        }}
        ModalProps={{
          style: { position: "relative", backgroundColor: "#293241" },
        }}
        variant="persistent"
        open={isDrawerVisible}
        css={[styles.drawer, isDrawerVisible && styles.drawerVisible]}
      >
        <Channels />
      </Drawer>
      <Routes>
        <Route path=":id" element={<Channel />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Welcome />} />
      </Routes>
    </main>
  );
}
