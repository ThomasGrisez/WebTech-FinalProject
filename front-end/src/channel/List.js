/** @jsxImportSource @emotion/react */
import React from "react";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useContext,
  useState,
} from "react";
// Layout

import Context from "../Context";
import { useTheme } from "@mui/styles";
import {
  Modal,
  Button,
  ButtonGroup,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// Markdown
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
// Time
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";
import axios from "axios";
dayjs.extend(calendar);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  calendar: {
    sameElse: "DD/MM/YYYY hh:mm A",
  },
});

const useStyles = (theme) => ({
  root: {
    position: "relative",
    flex: "1 1 auto",
    overflow: "auto",
    "& ul": {
      margin: 0,
      padding: 0,
      textIndent: 0,
      listStyleType: 0,
    },
  },
  form: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  title: {
    fontSize: 40,
    margin: "0.5em 0 0 0",
    fontWeight: "400",
    color: "white",
  },
  box: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
  message: {
    padding: ".2rem .5rem",
    ":hover": {
      backgroundColor: "rgba(255,255,255,.05)",
    },
  },
  headMessage: {
    display: "flex",
    justifyContent: "space-between",
  },
  fabWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50px",
  },
  fab: {
    position: "fixed !important",
    top: 0,
    width: "50px",
  },
  icon: {
    "&:hover": {
      background: "rgba(255,255,255,.4)",
      borderRadius: "30%",
    },
  },
});

export default forwardRef(
  ({ channel, messages, setMessages, onScrollDown }, ref) => {
    const styles = useStyles(useTheme());
    const { oauth } = useContext(Context);
    const [newContent, setContent] = useState("");
    // Expose the `scroll` action
    useImperativeHandle(ref, () => ({
      scroll: scroll,
    }));
    const rootEl = useRef(null);
    const scrollEl = useRef(null);
    const scroll = () => {
      scrollEl.current.scrollIntoView();
    };
    // See https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
    const throttleTimeout = useRef(null); // react-hooks/exhaustive-deps
    useLayoutEffect(() => {
      const rootNode = rootEl.current; // react-hooks/exhaustive-deps
      const handleScroll = () => {
        if (throttleTimeout.current === null) {
          throttleTimeout.current = setTimeout(() => {
            throttleTimeout.current = null;
            const { scrollTop, offsetHeight, scrollHeight } = rootNode; // react-hooks/exhaustive-deps
            onScrollDown(scrollTop + offsetHeight < scrollHeight);
          }, 200);
        }
      };
      handleScroll();
      rootNode.addEventListener("scroll", handleScroll);
      return () => rootNode.removeEventListener("scroll", handleScroll);
    });

    //Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const updateMessages = () => {
      fetchMessages();
    };
    const fetchMessages = async () => {
      setMessages([]);
      const { data: messages } = await axios.get(
        `http://localhost:3001/channels/${channel.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${oauth.access_token}`,
          },
        }
      );
      setMessages(messages);
    };

    // Delete a message
    const handleDelete = async (messageToDelete) => {
      await axios.delete(
        `http://localhost:3001/channels/${channel.id}/messages/${messageToDelete.creation}`
      );
      updateMessages();
    };
    // Modify a message
    const handleChangeContent = (e) => {
      setContent(e.target.value);
    };
    const handleModify = async (messageToModify) => {
      await axios.put(
        `http://localhost:3001/channels/${channel.id}/messages/${messageToModify.creation}`,
        {
          content: newContent,
        },
        {
          headers: {
            Authorization: `Bearer ${oauth.access_token}`,
          },
        }
      );
      updateMessages();
    };

    return (
      <div css={styles.root} ref={rootEl}>
        <h1>Messages for {channel.name}</h1>
        <ul>
          {messages.map((message, i) => {
            const { value } = unified()
              .use(markdown)
              .use(remark2rehype)
              .use(html)
              .processSync(message.content);
            return (
              <li key={i} css={styles.message}>
                <div css={styles.headMessage}>
                  <div>
                    <span>{message.author}</span>
                    {" - "}
                    <span>{dayjs().calendar(message.creation)}</span>
                  </div>
                  {oauth.name === message.author ? (
                    <div>
                      <ButtonGroup>
                        <EditIcon
                          css={styles.icon}
                          onClick={() => {
                            handleOpen();
                            setContent(message.content);
                          }}
                        />
                        <Modal open={open}>
                          <Box sx={styles.box}>
                            <div
                              style={{ textAlign: "center", margin: "0 0 0 0" }}
                            >
                              <h1 css={styles.title}>Modify your message</h1>
                            </div>
                            <form noValidate>
                              <Grid container css={styles.form}>
                                <TextField
                                  id="content"
                                  name="content"
                                  value={newContent}
                                  variant="outlined"
                                  fullWidth
                                  onChange={handleChangeContent}
                                />
                              </Grid>
                              <Grid container spacing={1} justify="center">
                                <Button
                                  style={{ margin: "0 auto 0 auto" }}
                                  type="input"
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => {
                                    handleModify(message);
                                    handleClose();
                                  }}
                                >
                                  Modify
                                </Button>
                              </Grid>
                            </form>
                          </Box>
                        </Modal>
                        <DeleteIcon
                          css={styles.icon}
                          onClick={() => {
                            handleDelete(message);
                          }}
                        />
                      </ButtonGroup>
                    </div>
                  ) : (
                    <span></span>
                  )}
                </div>
                <div dangerouslySetInnerHTML={{ __html: value }}></div>
              </li>
            );
          })}
        </ul>
        <div ref={scrollEl} />
      </div>
    );
  }
);
