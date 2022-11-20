const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

const saltRounds = 10;
// DO NOT COMMIT THIS TO GIT
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgFk7ROErbcpKf92h6hIDUSQdE9BJ+CKT3lU1OGvESyfcLRru/aKd
OMfydcqHkX4N5ZkUXRPYaeKZUdp9IqpqZbLAfxQhIK4qxDvMlPpwo7FZgMeJgkpz
8OaZIOsaQgl/rhJ4eIH/BxCAGuw8BdjvXpUooI6XvLazGhM56Q+mUJRLAgMBAAEC
gYAsSc6WNAf6L5/nUUXsStkrI4OCDjSqdNoVUKUAWB01W4LHq3cYDxDvrNfp/f+o
oR0kLYdFIlTrs019ND7Qdp6i0/sVwAP72fMCz0mJ9lwYa0wIhgsCa+zefOVQ1lLe
jPw8XotG4GTgefxiL7O4bR/o2FJIxlheX4NPiX8VB0G8gQJBAJmIF7V+Y6i1jgrZ
UvGAxm57pyVa3U42zZTSeRaZgyXdpIjXJvj405Gb7KaZHMEV5EYq1f4kyWeOXqUM
t97lHO0CQQCUyRLfiCG5uVQ1O4S+LQBEQ43NJTgUWvHHNEV43N6/2i2BQx9/GbCp
xGljo5K+5y4czNnGiemU0bnE+VEOIocXAkB6P2HZcsy5re5u9wJTJ51YpX6+gK5M
M9jX0gr2kr9ZbDUxfFcc0Uvs2gHB2ZKKr/q2YC9KEFKJ8VOtCgZyJW41AkBJLw5l
fSR5ojtVY81Lbf8vlLrvKVuIR6OdhIyXgqzeWYcAie+4KP7Iwp/ELvVDiZsY93o3
Oib22KIzzR6dgUZJAkBM7gcFBH/FONsBwKV4D1N6I5ADAL99s96RB5xgK7u61UD8
YSXPm02fqkFHCYIZw20b2GsnUqDh2fQ23byUvy7F
-----END RSA PRIVATE KEY-----`;

router.use(function (req, res, next) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      req.hashedPassword = hash;
      next();
    });
  });
});

router.post("/login", async function (req, res, next) {
  if (req.body.username && req.body.password) {
    const user = await User.findOne()
      .where("username")
      .equals(req.body.username)
      .exec();
    if (user) {
      return bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (result === true) {
            const token = jwt.sign({ id: user._id }, privateKey, {
              algorithm: "RS256",
            });
            return res
              .status(200)
              .json({ username: user.username, access_token: token });
          } else {
            return res.status(401).json({ error: "Invalid credentials." });
          }
        })
        .catch((error) => {
          return res.status(500).json({ error: error.message });
        });
    }
    return res.status(401).json({ error: "Invalid credentials." });
  } else {
    res.status(400).json({ error: "Username or Password Missing" });
  }
});

router.post("/register", async function (req, res, next) {
  if (req.body.username && req.body.password && req.body.passwordConfirmation) {
    if (req.body.password === req.body.passwordConfirmation) {
      const user = new User({
        username: req.body.username,
        password: req.hashedPassword,
      });
      return user
        .save()
        .then((savedUser) => {
          const token = jwt.sign({ id: user._id }, privateKey, {
            algorithm: "RS256",
          });
          return res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
            access_token: token,
          });
        })
        .catch((error) => {
          return res.status(500).json({ error: "Something went wrong." });
        });
    }
    res.status(400).json({ error: "Passwords not matching" });
  } else {
    res.status(400).json({ error: "Username or Password Missing" });
  }
});

module.exports = router;
