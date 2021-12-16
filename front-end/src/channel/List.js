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
  messageBox: {
    display: "flex",
    flexDirection: "column",
  },
  messageOther: {
    padding: ".2rem .5rem",
    ":hover": {
      backgroundColor: "rgba(255,255,255,.05)",
    },
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  messageUser: {
    padding: ".2rem .5rem",
    ":hover": {
      backgroundColor: "rgba(255,255,255,.05)",
    },
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-end",
    justifyContent: "flex-end",
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
  messageContentOther: {
    backgroundColor: "grey",
    borderRadius: "5px",
    width: "fit-content",
    padding: "1px 10px",
  },
  messageContentUser: {
    backgroundColor: "blue",
    borderRadius: "5px",
    width: "fit-content",
    padding: "1px 10px",
  },
});

export default forwardRef(
  ({ channel, messages, setMessages, onScrollDown }, ref) => {
    const styles = useStyles(useTheme());
    const { oauth } = useContext(Context);
    const [newContent, setContent] = useState("");
    const [creationMessage, setCreationMessage] = useState("");
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
    const handleModify = async (messageToModifyCreation) => {
      await axios.put(
        `http://localhost:3001/channels/${channel.id}/messages/${messageToModifyCreation}`,
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

    //Modal
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
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
              <div>
                {oauth.name === message.author ? (
                  <li key={i} css={styles.messageUser}>
                    <div css={styles.messageBox}>
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
                                  setCreationMessage(message.creation);
                                  setContent(message.content);
                                }}
                              />
                              <DeleteIcon
                                css={styles.icon}
                                onClick={() => {
                                  handleDelete(message);
                                }}
                              />
                            </ButtonGroup>
                            <Modal open={open}>
                              <Box sx={styles.box}>
                                <div
                                  style={{
                                    textAlign: "center",
                                    margin: "0 0 0 0",
                                  }}
                                >
                                  <h1 css={styles.title}>
                                    Modify your message
                                  </h1>
                                </div>
                                <form>
                                  {/* Content to modify */}
                                  <Grid container css={styles.form}>
                                    <TextField
                                      id="content"
                                      name="content"
                                      defaultValue={newContent}
                                      variant="outlined"
                                      fullWidth
                                      onChange={handleChangeContent}
                                    />
                                  </Grid>
                                  {/* Validate */}
                                  <Grid container spacing={1} justify="center">
                                    <Button
                                      style={{ margin: "0 auto 0 auto" }}
                                      type="input"
                                      variant="contained"
                                      color="secondary"
                                      onClick={() => {
                                        handleModify(creationMessage);
                                        handleClose();
                                      }}
                                    >
                                      Modify
                                    </Button>
                                  </Grid>
                                </form>
                              </Box>
                            </Modal>
                          </div>
                        ) : (
                          <span></span>
                        )}
                      </div>
                      <div
                        dangerouslySetInnerHTML={{ __html: value }}
                        css={styles.messageContentUser}
                      ></div>
                    </div>
                  </li>
                ) : (
                  <li key={i} css={styles.messageOther}>
                    <div css={styles.messageBox}>
                      <div css={styles.headMessage}>
                        <div>
                          <span>{message.author}</span>
                          {" - "}
                          <span>{dayjs().calendar(message.creation)}</span>
                        </div>
                      </div>

                      <div
                        dangerouslySetInnerHTML={{ __html: value }}
                        css={styles.messageContentOther}
                      ></div>
                    </div>
                  </li>
                )}
              </div>
            );
          })}
        </ul>
        <div ref={scrollEl} />
      </div>
    );
  }
);
