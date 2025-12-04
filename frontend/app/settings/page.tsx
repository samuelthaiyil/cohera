import { SignOutButton } from "@clerk/nextjs";

export default function Settings() {
  return (
    <div className="p-8">
      <h1 className="tracking-tighter text-2xl">Settings</h1>
      <div className="py-3">
        <SignOutButton className="bg-red-500 text-white px-4 py-2" />
      </div>
    </div>
  );
}
