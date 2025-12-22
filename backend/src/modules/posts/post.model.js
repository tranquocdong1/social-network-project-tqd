const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, default: "" },
    images: { type: [String], default: [] }, // URLs
    visibility: { type: String, enum: ["public"], default: "public" },
    status: { type: String, enum: ["active", "deleted"], default: "active", index: true },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
