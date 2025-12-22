import RegisterForm from "../components/RegisterForm";
import AuthCard from "../components/AuthCard";

export default function RegisterPage() {
  return (
    <AuthCard title="Create account" subtitle="Join the community in seconds">
      <RegisterForm />
    </AuthCard>
  );
}
