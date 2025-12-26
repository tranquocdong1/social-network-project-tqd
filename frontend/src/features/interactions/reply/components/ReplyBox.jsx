import { useState } from "react";

export default function ReplyBox({ onSubmit, loading }) {
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
        placeholder="Write a reply..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
    </form>
  );
}
