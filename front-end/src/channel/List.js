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

import Context from "../components/Context";
import { useTheme } from "@mui/styles";
import { Modal, Button, ButtonGroup, Box, TextField } from "@mui/material";
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
    sameElse: "DD/MM H:mm",
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
  channelTitle: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "450",
    color: "#3D5A80",
  },
  title: {
    fontSize: 40,
    margin: "0 0 0 0",
    fontWeight: "400",
    color: "white",
  },
  // Edit & Delete Buttons
  icon: {
    "&:hover": {
      background: "rgba(255,255,255,.4)",
      borderRadius: "30%",
    },
    fill: "#3D5A80",
  },
  messageBox: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "2px",
  },
  // User message
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: "5px",
  },
  messagePositionUser: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: "5px",
    marginLeft: "5px",
  },
  messageContentUser: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#3D5A80",
    borderRadius: "10px",
    padding: "0 10px",
  },

  // Other users messages
  headerMessage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: "5px",
  },
  messageContentOthers: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#98C1D9",
    width: "fit-content",
    borderRadius: "10px",
    padding: "0 10px",
  },
  messagePositionOthers: {
    display: "flex",
    flexDirection: "row",
    width: "fit-content",
    borderRadius: "10px",
    padding: "0 10px",
  },
  texts: {
    fontSize: 15,
    color: "#3D5A80",
  },
  boxModal: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#3D5A80",
    border: "2px solid #293241",
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  },
  textModifMessage: {
    margin: "10px auto",
  },

  validateButton: {
    width: "fit-content",
    margin: "0 auto",
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
        <h1 css={styles.channelTitle}>Messages for {channel.name}</h1>
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
                  <li key={i} css={styles.messageBox}>
                    {/* Header */}
                    <div css={styles.header}>
                      {/* Header infos */}
                      <span css={styles.texts}>{message.author}</span>
                      <span css={styles.texts}>{" - "}</span>
                      <span css={styles.texts}>
                        {dayjs().calendar(message.creation)}
                      </span>
                      {oauth.name === message.author ? (
                        // Header buttons
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
                            <Box sx={styles.boxModal}>
                              <p css={styles.title}>Modify your message</p>

                              <TextField
                                id="content"
                                name="content"
                                defaultValue={newContent}
                                variant="outlined"
                                fullWidth
                                css={styles.textModifMessage}
                                onChange={handleChangeContent}
                              />
                              <Button
                                type="input"
                                variant="contained"
                                color="secondary"
                                css={styles.validateButton}
                                onClick={() => {
                                  handleModify(creationMessage);
                                  handleClose();
                                }}
                              >
                                Modify
                              </Button>
                            </Box>
                          </Modal>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </div>

                    {/* Content Message */}
                    <div css={styles.messagePositionUser}>
                      <div css={styles.messageContentUser}>
                        <div dangerouslySetInnerHTML={{ __html: value }} />
                      </div>
                    </div>
                  </li>
                ) : (
                  // Box Message
                  <li key={i} css={styles.messageBox}>
                    {/* Header Message */}
                    <div css={styles.headerMessage}>
                      <span css={styles.texts}>{message.author}</span>
                      <span css={styles.texts}>{" - "}</span>
                      <span css={styles.texts}>
                        {dayjs().calendar(message.creation)}
                      </span>
                    </div>
                    {/* Content Message */}
                    <div css={styles.messagePositionOthers}>
                      <div css={styles.messageContentOthers}>
                        <div dangerouslySetInnerHTML={{ __html: value }} />
                      </div>
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
