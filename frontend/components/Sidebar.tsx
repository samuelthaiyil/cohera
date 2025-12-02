import { SignOutButton } from "@clerk/nextjs";

export const Sidebar = () => {
  return (
    <div className="p-8">
      <SignOutButton />
    </div>
  );
};
