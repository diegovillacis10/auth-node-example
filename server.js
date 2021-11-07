const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

// Allows our app to accept json
app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/user", async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // With this we can skip the step of creating the salt on our own
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      name: req.body.name,
      password: hashedPassword,
    };

    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/user/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) return res.status(400).send("Cannot find user");
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.status(403).send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(3000);
