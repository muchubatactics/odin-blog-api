import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { CommentModel } from "../models/comment";

const commentController = {
  getCommentById: async function (req: Request, res: Response) {
    try {
      const { postId, id: commentId } = req.params;
      if (!isValidObjectId(postId)) {
        return res.status(400).json({
          message: `Post id, ${postId}, is invalid or malformed.`,
        });
      }
      if (!isValidObjectId(commentId)) {
        return res.status(400).json({
          message: `Comment id, ${commentId}, is invalid or malformed.`,
        });
      }

      const storedComment = await CommentModel.findOne({
        _id: commentId,
        post: postId,
      });
      if (!storedComment) {
        return res.status(404).json({
          message: `comment with id, ${commentId}, and post id, ${postId}, was not found.`,
        });
      }
      return storedComment;
    } catch (e) {
      console.error(`Error fetching comment by id: ${e}`);
      return res.status(500).json({
        message:
          process.env.NODE_ENV === "production"
            ? "Internal server error occurred. Please try again later."
            : (e as Error).message,
      });
    }
  },

  // GET /:postId/comments
  getComments: async function (req: Request, res: Response) {
    // todo
    res.send("Get all comments");
  },

  // POST /:postId/comments
  createComment: async function (req: Request, res: Response) {
    // todo
    res.send("Create a new comment");
  },

  // PATCH /:postId/comments/:id
  updateComment: async function (req: Request, res: Response) {
    // todo
    res.send("Update a comment");
  },

  // DELETE /:postId/comments/:id
  deleteComment: async function (req: Request, res: Response) {
    // todo
    res.send("Delete a comment");
  },
};

export default commentController;
