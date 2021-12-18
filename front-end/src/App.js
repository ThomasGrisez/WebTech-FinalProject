/** @jsxImportSource @emotion/react */
import { useContext, useState } from "react";
// Local
import Oups from "./Oups";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from "./components/Main";
import Login from "./components/Login";
import Context from "./components/Context";
// Rooter
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

const styles = {
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#E0FBFC",
  },
};

export default function App() {
  const location = useLocation();
  const { oauth } = useContext(Context);
  const [drawerMobileVisible, setDrawerMobileVisible] = useState(false);
  const drawerToggleListener = () => {
    setDrawerMobileVisible(!drawerMobileVisible);
  };
  const gochannels = (
    <Navigate
      to={{
        pathname: "/channels",
        state: { from: location },
      }}
    />
  );
  const gohome = (
    <Navigate
      to={{
        pathname: "/",
        state: { from: location },
      }}
    />
  );
  return (
    <div className="App" css={styles.root}>
      <Header drawerToggleListener={drawerToggleListener} />
      <Routes>
        <Route exact path="/" element={oauth ? gochannels : <Login />} />
        <Route path="/channels/*" element={oauth ? <Main /> : gohome} />
        <Route path="/Oups" element={<Oups />} />
      </Routes>
      <Footer />
    </div>
  );
}
