/** @jsxImportSource @emotion/react */

const styles = {
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "fit-content",
    padding: "5px",
    backgroundColor: "#293241",
    flexShrink: 0,
    borderTop: "1px solid black",
  },
};

export default function Footer() {
  return (
    <footer style={styles.footer}>&copy; Copyright 2021 - Thomas Grisez</footer>
  );
}
