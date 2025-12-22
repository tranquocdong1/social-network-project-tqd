export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger py-2 mt-3" role="alert">
      {message}
    </div>
  );
}
