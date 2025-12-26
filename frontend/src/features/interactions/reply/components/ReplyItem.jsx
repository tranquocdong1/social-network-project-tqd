export default function ReplyItem({ reply }) {
  return (
    <div className="d-flex gap-2 small mt-2">
      <img
        src={reply.author.avatar || "https://via.placeholder.com/24"}
        width="24"
        height="24"
        className="rounded-circle"
        alt="avatar"
      />
      <div>
        <b>{reply.author.fullName}</b> {reply.content}
      </div>
    </div>
  );
}
