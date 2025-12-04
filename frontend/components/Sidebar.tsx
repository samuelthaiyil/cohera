"use client"

import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type SidebarItem = {
  name: string;
  slug: string;
};

const sidebarItems: SidebarItem[] = [
  {
    name: "Notebooks",
    slug: "/notebooks",
  },
  {
    name: "Settings",
    slug: "/settings",
  },
];

export const Sidebar = () => {
  const router = useRouter();

  const handleNavigate = (slug: string) => {
    router.push(slug);
  };

  return (
    <div className="p-8 b-1 border-r-1 border-gray-200 h-screen">
      <img src="/logo.svg" width="150px" alt="cohera logo" />
      <div className="mt-5">
        {sidebarItems.map(({ name, slug }) => {
          return (
            <div
              key={slug}
              className="py-3 hover:bg-gray-200"
              onClick={() => handleNavigate(slug)}
            >
              {name}
            </div>
          );
        })}
      </div>
      <div className="py-3">
        <SignOutButton />
      </div>
    </div>
  );
};
