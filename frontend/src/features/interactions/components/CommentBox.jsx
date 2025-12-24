import { useState } from "react";

export default function CommentBox({ onSubmit }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <form onSubmit={submit} className="mt-2">
      <input
        className="form-control form-control-sm"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </form>
  );
}
