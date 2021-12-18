const db = require("./db");
const express = require("express");
const cors = require("cors");
const authenticator = require("./authenticator");

const app = express();
const authenticate = authenticator({
  test_payload_email: process.env["TEST_PAYLOAD_EMAIL"],
  jwks_uri: "http://127.0.0.1:5556/dex/keys",
});

app.use(require("body-parser").json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(["<h1>ECE WebTech Chat</h1>"].join(""));
});

// Channels

// app.get("/channels", async (req, res) => {
//   const channels = await db.channels.channelsOfUser(req.body.email);
//   console.log(req.body.email);
//   res.json(channels);
// });

app.get("/channels", async (req, res) => {
  const channels = await db.channels.list();
  res.json(channels);
});

//Create channel with invited friends
app.post("/channels", async (req, res) => {
  try {
    const channel = await db.channels.create(req.body);
    //Add the channel to the users
    if (channel && channel.channelUsers) {
      for (const userID of channel.channelUsers) {
        await db.users.inviteToChannel(userID, channel.id);
      }
    }
    res.status(201).json(channel);
  } catch (err) {
    console.log(err);
  }
});

app.get("/channels/:id", async (req, res) => {
  const channel = await db.channels.get(req.params.id);
  res.json(channel);
});

app.put("/channels/:id", async (req, res) => {
  const channel = await db.channels.update(req.body);
  res.json(channel);
});

// Messages

app.get("/channels/:id/messages", async (req, res) => {
  try {
    const channel = await db.channels.get(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(404).send("Channel does not exist.");
  }
  const messages = await db.messages.list(req.params.id);
  res.json(messages);
});

// New message
app.post("/channels/:id/messages", async (req, res) => {
  const message = await db.messages.create(req.params.id, req.body);
  res.status(201).json(message);
});

// Delete message
app.delete("/channels/:id/messages/:idMessage", async (req, res) => {
  const message = await db.messages.delete(req.params.id, req.params.idMessage);
  res.status(204).json(message);
});

// Modify message
app.put("/channels/:id/messages/:idMessage", async (req, res) => {
  const message = await db.messages.update(
    req.params.id,
    req.params.idMessage,
    req
  );
  res.status(204).json(message);
});

// Users

//Get all the users
app.get("/users", async (req, res) => {
  const users = await db.users.list();
  res.json(users);
});

//Create new user
app.post("/users", async (req, res) => {
  const user = await db.users.create(req.body);
  res.status(201).json(user);
});

//Get a user with the id
app.get("/users/:id", async (req, res) => {
  const user = await db.users.get(req.params.id);
  res.json(user);
});

//Get a user with the email
app.get("/useremails/:email", async (req, res) => {
  const user = await db.users.getByEmail(req.params.email);
  res.json(user);
});

//invite to channel
app.post("/channelsinvite/:id", async (req, res) => {
  try {
    const channel = await db.channels.get(req.params.id);
    usersToInviteID = req.body.friends;
    //Add the channel to the users
    if (channel && usersToInviteID) {
      for (const userID of usersToInviteID) {
        await db.users.inviteToChannel(userID, channel.id);
      }
    }
    res.status(201).json(channel);
  } catch (err) {
    console.log(err);
  }
});

// Modify a user with the id
app.put("/users/:id", async (req, res) => {
  const user = await db.users.update(req.body);
  res.json(user);
});

module.exports = app;
