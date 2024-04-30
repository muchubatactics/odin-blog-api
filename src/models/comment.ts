import {
  CallbackWithoutResultAndOptionalError,
  Document,
  Schema,
  model,
} from "mongoose";
import { UserModelName } from "./user";
import { PostModelName } from "./post";

const CommentModelName = "Comment";
const CommentSchema = new Schema(
  {
    body: { type: String, required: true },
    tldr: { type: String, default: "nil", maxLength: 64 },
    user: {
      type: Schema.Types.ObjectId,
      ref: UserModelName,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: PostModelName,
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: CommentModelName,
      default: null,
    },
    childComments: [
      { type: Schema.Types.ObjectId, ref: CommentModelName, default: [] },
    ],
  },
  {
    timestamps: true,
    strictQuery: "throw",
    toJSON: { transform: toJsonHandler, flattenObjectIds: true },
  }
);
CommentSchema.pre(
  ["find", "findOne"],
  function (next: CallbackWithoutResultAndOptionalError) {
    this.clone().populate({
      path: "user",
      select: "name",
    });
    return next();
  }
);
CommentSchema.pre("save", async function (this: Document) {
  try {
    await this.populate({
      path: "user",
      select: "name",
    });
  } catch (e) {
    console.error(
      "error during post middleware on saving a comment",
      e as Error
    );
  }
});
function toJsonHandler(doc: Document, ret: any) {
  // NOTE: never mark this function as 'async'
  ret.id = ret._id;
  ret.dateCreated = ret.createdAt;
  ret.dateUpdated = ret.updatedAt;

  // populate user name field
  if (ret.user && ret.user.name) {
    ret.user = ret.user.name;
  }

  delete ret.createdAt;
  delete ret.updatedAt;
  delete ret._id;
  delete ret.__v;

  return ret;
}
export const CommentModel = model(CommentModelName, CommentSchema);
