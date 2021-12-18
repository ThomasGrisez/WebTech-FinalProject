/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from "react";
import axios from "axios";
// Layout
import { Link as RouterLink } from "react-router-dom";
// Local
import Context from "./Context";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ForumIcon from "@mui/icons-material/Forum";
import IconButton from "@mui/material/IconButton";

const styles = {
  root: {
    backgroundColor: "#293241",
    borderRight: "1px solid black",
    "& a": {
      padding: ".2rem .5rem",
      whiteSpace: "nowrap",
    },
  },
};

export default function Channels() {
  const { oauth, channels, setChannels } = useContext(Context);
  const naviate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: channels } = await axios.get(
          "http://localhost:3001/channels",
          {
            email: oauth.email,
            headers: {
              Authorization: `Bearer ${oauth.access_token}`,
            },
          }
        );
        setChannels(channels);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [oauth, setChannels]);

  return (
    <ul css={styles.root}>
      <li css={styles.channel}>
        <IconButton to="/channels" component={RouterLink}>
          <HomeIcon />
          Home
        </IconButton>
      </li>
      {channels.map((channel, i) => (
        <li key={i} css={styles.channel}>
          <IconButton
            href={`/channels/${channel.id}`}
            onClick={(e) => {
              e.preventDefault();
              naviate(`/channels/${channel.id}`);
            }}
          >
            <ForumIcon />
            {channel.name}
          </IconButton>
        </li>
      ))}
    </ul>
  );
}
