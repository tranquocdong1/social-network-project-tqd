import ReplyItem from "./ReplyItem";

export default function ReplyList({ replies }) {
  return (
    <div className="ms-4 mt-2">
      {replies.map((r) => (
        <ReplyItem key={r.id} reply={r} />
      ))}
    </div>
  );
}
