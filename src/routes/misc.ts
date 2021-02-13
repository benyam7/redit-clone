import { Request, Response, Router } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import User from "../entities/User";
import Vote from "../entities/Vote";
import auth from "../middleware/auth";
import user from "../middleware/user";

const vote = async (req: Request, res: Response) => {
  const { identitfier, slug, commentIdentifier, value } = req.body;

  // validate vote value
  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({ value: "value must be -1, 0 or 1" });
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identitfier });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      // find vote by comment
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      // find vote by post
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value === 0) {
      // no vote and value zero
      return res.status(404).json({ error: "Vote not found" });
    } else if (!vote) {
      // no vote already, so create new
      vote = new Vote({ user, value });
      //   if vote is for comment
      if (comment) vote.comment = comment;
      //   if vote is for post
      else vote.post = post;

      if (post) await vote.save();
    } else if (value === 0) {
      // vote exists already n value 0
      await vote.remove();
    } else if (vote.value !== value) {
      // if vote and value has changed
      vote.value = value;
      await vote.save();
    }

    // refectch post along with votes, and comments

    post = await Post.findOneOrFail(
      { identitfier, slug },
      { relations: ["comments", "comments.votes", "sub", "votes"] }
    );
    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "something went wrong" });
  }
};

const router = Router();

router.post("/vote", user, auth, vote);

export default router;
