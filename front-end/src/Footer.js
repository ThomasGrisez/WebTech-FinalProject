/** @jsxImportSource @emotion/react */

const styles = {
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "30px",
    backgroundColor: "rgba(255,255,255,.3)",
    flexShrink: 0,
  },
};

export default function Footer() {
  return (
    <footer style={styles.footer}>&copy; Copyright 2021 - Thomas Grisez</footer>
  );
}
