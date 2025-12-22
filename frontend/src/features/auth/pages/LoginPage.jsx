import LoginForm from "../components/LoginForm";
import AuthCard from "../components/AuthCard";

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" subtitle="Login to continue">
      <LoginForm />
    </AuthCard>
  );
}
