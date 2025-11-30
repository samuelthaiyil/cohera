import { SignIn } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="m-auto">
      <SignIn />
    </div>
  );
}
