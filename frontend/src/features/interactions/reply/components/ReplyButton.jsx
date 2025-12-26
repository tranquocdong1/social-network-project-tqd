export default function ReplyButton({ onClick }) {
  return (
    <button
      className="btn btn-link btn-sm text-decoration-none px-0"
      onClick={onClick}
    >
      Reply
    </button>
  );
}
