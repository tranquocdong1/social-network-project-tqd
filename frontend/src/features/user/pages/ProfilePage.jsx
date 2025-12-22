import { Link } from "react-router-dom";
import { useAuth } from "../../auth/auth.context";
import ProfileCard from "../components/ProfileCard";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 fw-bold mb-0">My Profile</h1>
          <Link className="btn btn-outline-primary btn-sm" to="/profile/edit">
            Edit profile
          </Link>
        </div>
        <ProfileCard user={user} />
      </div>
    </div>
  );
}
