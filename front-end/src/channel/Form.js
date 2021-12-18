/** @jsxImportSource @emotion/react */
import { useState, useContext } from "react";
import axios from "axios";
// Layout
import { Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/styles";
import Context from "../components/Context";

const useStyles = (theme) => {
  return {
    form: {
      borderTop: `1px solid black`,
      padding: ".5rem",
      display: "flex",
      backgroundColor: "#293241",
    },
    content: {
      flex: "1 1 auto",
      "&.MuiTextField-root": {
        marginRight: theme.spacing(1),
        backgroundColor: "#293241",
      },
    },
  };
};

export default function Form({ addMessage, channel }) {
  const { oauth } = useContext(Context);
  const [content, setContent] = useState("");
  const styles = useStyles(useTheme());
  const onSubmit = async () => {
    const { data: message } = await axios.post(
      `http://localhost:3001/channels/${channel.id}/messages`,
      {
        content: content,
        author: oauth.name,
      }
    );
    addMessage(message);
    setContent("");
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };
  return (
    <form css={styles.form} onSubmit={onSubmit} noValidate>
      <TextField
        id="outlined-multiline-flexible"
        label="Message"
        multiline
        maxRows={4}
        value={content}
        onChange={handleChange}
        variant="outlined"
        css={styles.content}
      />
      <div>
        <Button
          variant="contained"
          color="primary"
          css={styles.send}
          endIcon={<SendIcon />}
          onClick={onSubmit}
        >
          Send
        </Button>
      </div>
    </form>
  );
}
