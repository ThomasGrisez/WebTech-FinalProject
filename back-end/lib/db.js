const { v4: uuid } = require("uuid");
const { clone, merge } = require("mixme");
const microtime = require("microtime");
const level = require("level");
const db = level(__dirname + "/../db");

module.exports = {
  channels: {
    // Create channel with its name, email of owner and list of users
    create: async (channel) => {
      if (!channel.name) throw Error("Invalid channel");
      const id = uuid();
      if (!channel.channelUsers) channel.channelUsers = [];
      //To be sure we don't have duplicate in idUsers
      const uniqueIdUsers = [...new Set(channel.channelUsers)];
      channel.channelUsers = uniqueIdUsers;
      await db.put(`channels:${id}`, JSON.stringify(channel));
      return merge(channel, { id: id });
    },
    // Get a channel
    get: async (id) => {
      if (!id) throw Error("Invalid id");
      const data = await db.get(`channels:${id}`);
      const channel = JSON.parse(data);
      return merge(channel, { id: id });
    },
    // Get all channels
    list: async () => {
      return new Promise((resolve, reject) => {
        const channels = [];
        db.createReadStream({
          gt: "channels:",
          lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        })
          .on("data", ({ key, value }) => {
            channel = JSON.parse(value);
            channel.id = key.split(":")[1];
            channels.push(channel);
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            resolve(channels);
          });
      });
    },
    // Get the channels of a user
    channelsOfUser: async (userEmail) => {
      const user = await module.exports.users.getByEmail(userEmail);
      const channels = [];
      if (user.channels) {
        for (const channel of user.channels) {
          const channelOfUser = await db.channels.get(channel);
          channels.push(channelOfUser);
        }
      }
      return channels;
    },
    // Modify a channel
    update: (id, channel) => {
      const original = store.channels[id];
      if (!original) throw Error("Unregistered channel id");
      store.channels[id] = merge(original, channel);
    },
    // Delete a channel
    delete: (id, channel) => {
      const original = store.channels[id];
      if (!original) throw Error("Unregistered channel id");
      delete store.channels[id];
    },
  },
  messages: {
    create: async (channelId, message) => {
      if (!channelId) throw Error("Invalid channel");
      if (!message.author) throw Error("Invalid message");
      if (!message.content) throw Error("Invalid message");
      creation = microtime.now();
      await db.put(
        `messages:${channelId}:${creation}`,
        JSON.stringify({
          author: message.author,
          content: message.content,
        })
      );
      return merge(message, { channelId: channelId, creation: creation });
    },
    get: async (channelId, creation) => {
      if (!channelId) throw Error("Invalid channel id");
      if (!creation) throw Error("Invalid message id");
      const data = await db.get(`messages:${channelId}:${creation}`);
      const message = JSON.parse(data);
      return merge(message, { creation: creation });
    },
    delete: async (channelId, creation) => {
      if (!message) throw Error("Invalid message");
      if (!channelId) throw Error("Invalid channel id");
      if (!creation) throw Error("Invalid message id");
      await db.del(`messages:${channelId}:${creation}`);
      return { success: true };
    },
    update: async (channelId, creation, req) => {
      if (!channelId) throw Error("Invalid channel");
      if (!creation) throw Error("Invalid message");
      const newContent = req.body.content;
      const data = await db.get(`messages:${channelId}:${creation}`);
      let message = JSON.parse(data);
      message.content = newContent;
      await db.put(
        `messages:${channelId}:${creation}`,
        JSON.stringify(message)
      );
      return message;
    },

    list: async (channelId) => {
      return new Promise((resolve, reject) => {
        const messages = [];
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte:
            `messages:${channelId}` +
            String.fromCharCode(":".charCodeAt(0) + 1),
        })
          .on("data", ({ key, value }) => {
            message = JSON.parse(value);
            const [, channelId, creation] = key.split(":");
            message.channelId = channelId;
            message.creation = creation;
            messages.push(message);
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            resolve(messages);
          });
      });
    },
  },
  users: {
    // Create a user
    create: async (user) => {
      try {
        const users = await module.exports.users.list();
        let alreadyExists = false;

        // Compare user to create with already existing users
        for (let i = 0; i < users.length; i++) {
          if (users[i].email.includes(user.email)) alreadyExists = true;
        }

        if (!user.username || !user.email || alreadyExists)
          throw Error("Invalid user");
        const id = uuid();
        await db.put(`users:${id}`, JSON.stringify(user));
        await db.put(`userEmails:${user.email}`, JSON.stringify({ id: id }));
        return merge(user, { id: id });
      } catch (err) {
        console.log(err);
      }
    },
    // Get a user by its id
    get: async (id) => {
      try {
        if (!id) throw Error("Invalid id");
        const data = await db.get(`users:${id}`);
        const user = JSON.parse(data);
        return merge(user, { id: id });
      } catch (err) {
        return null;
      }
    },
    // Get all users
    list: async () => {
      return new Promise((resolve, reject) => {
        const users = [];
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        })
          .on("data", ({ key, value }) => {
            user = JSON.parse(value);
            user.id = key.split(":")[1];
            users.push(user);
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            resolve(users);
          });
      });
    },
    // Update a user
    update: (id, user) => {
      const original = store.users[id];
      if (!original) throw Error("Unregistered user id");
      store.users[id] = merge(original, user);
    },
    // Delete a user
    delete: (id, user) => {
      const original = store.users[id];
      if (!original) throw Error("Unregistered user id");
      delete store.users[id];
    },
    // Get user by its email
    getByEmail: async (email) => {
      try {
        if (!email) throw Error("Invalid Email");
        var userId = await db.get(`userEmails:${email}`);
        userId = JSON.parse(userId);
        const user = await module.exports.users.get(userId.id);
        return user;
      } catch (err) {
        return err;
      }
    },
    //Add a channel id to the list of channels of a user
    inviteToChannel: async (userID, channelID) => {
      if (!userID) throw Error("invalid user ID");
      if (!channelID) throw Error("invalid channel ID");
      const data = await db.get(`users:${userID}`);
      const user = JSON.parse(data);
      //if user already has an array with the list of his channel
      if (user.channels) {
        user.channels.push(channelID); //we add the channel id to the array
        //To be sure we don't have duplicate, we use Set()
        listChannels = [...new Set(user.channels)];
        user.channels = listChannels;
      } else {
        user.channels = [channelID];
      }
      await db.put(`users:${userID}`, JSON.stringify(user));
      return user;
    },
  },
  admin: {
    clear: async () => {
      await db.clear();
    },
  },
};
