import { Link } from "react-router-dom";
import AuthTabs from "../components/auth/AuthTabs";

export default function Auth() {
  return (
    <div className="h-dvh flex flex-col justify-center items-center">
      <div className="w-full max-w-[400px] p-4 flex flex-col justify-center items-center">
        <Link to="/" className="button text-primary">
          Home
        </Link>
        <AuthTabs />
      </div>
    </div>
  );
}
