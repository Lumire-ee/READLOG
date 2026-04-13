import type { ReactNode } from "react";
import AppFooter from "@/components/AppFooter";

type HomeLayoutProps = {
  header: ReactNode;
  children: ReactNode;
};

export default function HomeLayout({ header, children }: HomeLayoutProps) {
  return (
    <div className="bg-gray-6 min-h-screen w-full">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6">
        <div className="flex-1 space-y-8">
          {header}
          {children}
        </div>
        <AppFooter />
      </div>
    </div>
  );
}
