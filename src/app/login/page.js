import AuthForm from "@/components/AuthForm";
import { login } from "@/app/actions";

export const metadata = { title: "Log in | TaskFlow AI" };

export default function LoginPage() {
  return (
    <AuthForm
      action={login}
      title="Log in"
      submitLabel="Log in"
      altText="No account yet?"
      altHref="/signup"
      altLabel="Sign up"
    />
  );
}