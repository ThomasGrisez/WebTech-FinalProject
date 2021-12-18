/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import crypto from "crypto";
import qs from "qs";
import axios from "axios";
// Layout
import React from "react";
import PropTypes from "prop-types";
import ButtonUnstyled, {
  buttonUnstyledClasses,
} from "@mui/core/ButtonUnstyled";
import { styled } from "@mui/system";
import { useTheme } from "@mui/styles";
import { Link } from "@mui/material";
// Local
import Context from "./Context";
import { useNavigate } from "react-router-dom";

const base64URLEncode = (str) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const sha256 = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest();
};

const useStyles = (theme) => ({
  root: {
    flex: "1 1 auto",
    background: "#E0FBFC",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    "& > div": {
      margin: `${theme.spacing(1)}`,
      marginLeft: "auto",
      marginRight: "auto",
    },
    "& fieldset": {
      border: "none",
      "& label": {
        marginBottom: theme.spacing(0.5),
        display: "block",
      },
    },
  },
  title: {
    fontSize: 60,
    fontWeight: "400",
    color: "#293241",
  },
});

//Button MUI
const ButtonRoot = React.forwardRef(function ButtonRoot(props, ref) {
  const { children, ...other } = props;

  return (
    <svg width="150" height="50" {...other} ref={ref}>
      <polygon points="0,50 0,0 150,0 150,50" className="bg" />
      <polygon points="0,50 0,0 150,0 150,50" className="borderEffect" />
      <foreignObject x="0" y="0" width="150" height="50">
        <div className="content">{children}</div>
      </foreignObject>
    </svg>
  );
});

ButtonRoot.propTypes = {
  children: PropTypes.node,
};

const CustomButtonRoot = styled(ButtonRoot)(
  ({ theme }) => `
  overflow: visible;
  cursor: pointer;
  --main-color: ${
    theme.palette.mode === "light" ? "rgb(25,118,210)" : "rgb(144,202,249)"
  };
  --hover-color: ${
    theme.palette.mode === "light"
      ? "rgba(25,118,210,0.04)"
      : "rgba(144,202,249,0.08)"
  };
  --active-color: ${
    theme.palette.mode === "light"
      ? "rgba(25,118,210,0.12)"
      : "rgba(144,202,249,0.24)"
  };

  & polygon {
    fill: transparent;
    transition: all 800ms ease;
    pointer-events: none;
  }
  
  & .bg {
    stroke: var(--main-color);
    stroke-width: 0.5;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1));
    fill: transparent;
  }

  & .borderEffect {
    stroke: var(--main-color);
    stroke-width: 2;
    stroke-dasharray: 150 600;
    stroke-dashoffset: 150;
    fill: transparent;
  }

  &:hover,
  &.${buttonUnstyledClasses.focusVisible} {
    .borderEffect {
      stroke-dashoffset: -600;
    }

    .bg {
      fill: var(--hover-color);
    }
  }

  &:focus,
  &.${buttonUnstyledClasses.focusVisible} {
    outline: none;
  }

  &.${buttonUnstyledClasses.active} { 
    & .bg {
      fill: var(--active-color);
      transition: fill 300ms ease-out;
    }
  }

  & foreignObject {
    pointer-events: none;

    & .content {
      font-family: Helvetica, Inter, Arial, sans-serif;
      font-size: 14px;
      font-weight: 200;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--main-color);
      text-transform: uppercase;
    }

    & svg {
      margin: 0 5px;
    }
  }`
);

const SvgButton = React.forwardRef(function SvgButton(props, ref) {
  return <ButtonUnstyled {...props} component={CustomButtonRoot} ref={ref} />;
});

const Redirect = ({ config, codeVerifier }) => {
  const styles = useStyles(useTheme());
  const redirect = (e) => {
    e.stopPropagation();
    const code_challenge = base64URLEncode(sha256(codeVerifier));
    const url = [
      `${config.authorization_endpoint}?`,
      `client_id=${config.client_id}&`,
      `scope=${config.scope}&`,
      `response_type=code&`,
      `redirect_uri=${config.redirect_uri}&`,
      `code_challenge=${code_challenge}&`,
      `code_challenge_method=S256`,
    ].join("");
    window.location = url;
  };
  return (
    <div css={styles.root}>
      <div>
        <h1 css={styles.title}>Welcome to ECE Chat</h1>
      </div>
      <SvgButton onClick={redirect} color="secondary">
        Login
      </SvgButton>
    </div>
  );
};

const Tokens = ({ oauth }) => {
  const { setOauth } = useContext(Context);
  const styles = useStyles(useTheme());
  const { id_token } = oauth;
  const id_payload = id_token.split(".")[1];
  const { email } = JSON.parse(atob(id_payload));
  const logout = (e) => {
    e.stopPropagation();
    setOauth(null);
  };
  return (
    <div css={styles.root}>
      Welcome {email}{" "}
      <Link onClick={logout} color="secondary">
        logout
      </Link>
    </div>
  );
};

const LoadToken = ({ code, codeVerifier, config, removeCookie, setOauth }) => {
  const styles = useStyles(useTheme());
  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.post(
          config.token_endpoint,
          qs.stringify({
            grant_type: "authorization_code",
            client_id: `${config.client_id}`,
            code_verifier: `${codeVerifier}`,
            redirect_uri: `${config.redirect_uri}`,
            code: `${code}`,
          })
        );
        removeCookie("code_verifier");
        setOauth(data);
        navigate("/");
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  });
  return <div css={styles.root}>Loading tokens</div>;
};

export default function Login({ onUser }) {
  const styles = useStyles(useTheme());
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const { oauth, setOauth } = useContext(Context);
  const config = {
    authorization_endpoint: "http://127.0.0.1:5556/dex/auth",
    token_endpoint: "http://127.0.0.1:5556/dex/token",
    client_id: "webtech-frontend",
    redirect_uri: "http://127.0.0.1:3000",
    scope: "openid%20email%20offline_access%20profile",
  };
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  // is there a code query parameters in the url
  if (!code) {
    // no: we are not being redirected from an oauth server
    if (!oauth) {
      const codeVerifier = base64URLEncode(crypto.randomBytes(32));
      console.log("set code_verifier", codeVerifier);
      setCookie("code_verifier", codeVerifier);
      return (
        <Redirect
          codeVerifier={codeVerifier}
          config={config}
          css={styles.root}
        />
      );
    } else {
      // yes: user is already logged in, great, is is working
      return <Tokens oauth={oauth} css={styles.root} />;
    }
  } else {
    // yes: we are coming from an oauth server
    console.log("get code_verifier", cookies.code_verifier);
    return (
      <LoadToken
        code={code}
        codeVerifier={cookies.code_verifier}
        config={config}
        setOauth={setOauth}
        removeCookie={removeCookie}
      />
    );
  }
}
