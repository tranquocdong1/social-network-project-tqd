const mongoose = require("mongoose");

const commentLikeSchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 1 user chỉ like 1 lần / comment
commentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });
commentLikeSchema.index({ commentId: 1 });
commentLikeSchema.index({ userId: 1 });

module.exports = mongoose.model("CommentLike", commentLikeSchema);
