import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth.context";
import EditProfileForm from "../components/EditProfileForm";

export default function EditProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 fw-bold mb-0">Edit profile</h1>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <EditProfileForm
          user={user}
          onUpdated={(u) => {
            setUser(u);
            navigate("/profile");
          }}
        />
      </div>
    </div>
  );
}
