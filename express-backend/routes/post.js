const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

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

const router = express.Router();

router.use(function (req, res, next) {
  if (req.header("Authorization")) {
    try {
      req.payload = jwt.verify(req.header("Authorization"), privateKey, {
        algorithms: ["RS256"],
      });
    } catch (error) {
      /// log the
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

router.post("/", async function (req, res) {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.payload.id,
    //id: req.pay,
    completed: req.body.completed,
    completedOn: req.body.completedOn,
  });
  return post
    .save()
    .then((savedPost) => {
      return res.status(201).json({
        _id: savedPost._id,
        title: savedPost.title,
        content: savedPost.content,
        author: savedPost.author,
        completed: savedPost.completed,
        completedOn: savedPost.completedOn,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong." });
    });
});

router.get("/", async function (req, res, next) {
  const posts = await Post.find().where("author").equals(req.payload.id).exec();
  //const posts = await Post.find().exec();
  return res.status(200).json({ posts: posts });
});

router.get("/:id", async function (req, res, next) {
  const post = await Post.findOne().where("_id").equals(req.params.id).exec();
  //const posts = await Post.find().exec();
  return res.status(200).json(post);
});

router.delete("/:id", async function (req, res, next) {
  const post = await Post.deleteOne().where("_id").equals(req.params.id).exec();
  return res.status(200).json(post);
});

router.patch("/:id", async function (req, res, next) {
  const filter = { _id: req.params.id };
  const update = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    completed: req.body.completed,
    completedOn: req.body.completedOn,
  };

  const post = await Post.findOneAndUpdate(filter, update);
  return res.status(200).json(post);
});

module.exports = router;
