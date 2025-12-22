export default function ProfileCard({ user }) {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3">
          <img
            src={user.avatar || "https://via.placeholder.com/80"}
            alt="avatar"
            width="80"
            height="80"
            className="rounded-circle border"
          />
          <div>
            <h2 className="h5 fw-bold mb-1">{user.fullName}</h2>
            <div className="text-muted">{user.email}</div>
            <span className="badge text-bg-secondary mt-2">{user.role}</span>
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <div className="text-muted small mb-1">Bio</div>
          <div>{user.bio || <span className="text-muted">No bio yet.</span>}</div>
        </div>
      </div>
    </div>
  );
}
