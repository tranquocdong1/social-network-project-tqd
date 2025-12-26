import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/auth.context";
import { logoutApi } from "../../api/auth.api";

export default function AppNavbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (_) {
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Social Mini
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>

        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">Profile</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile/edit">Edit</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/feed">Feed</NavLink>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="navbar-text me-3">
                    Hi, <span className="fw-semibold">{user.fullName}</span>
                  </span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
