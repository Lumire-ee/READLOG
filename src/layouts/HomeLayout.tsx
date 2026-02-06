import type { ReactNode } from "react";

type HomeLyaoutProps = {
  header: ReactNode;
  children: ReactNode;
};

export default function HomeLayout({ header, children }: HomeLyaoutProps) {
  return (
    <div className="bg-gray-6 min-h-screen w-full">
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="space-y-8">
          {header}
          {children}
        </div>
      </div>
    </div>
  );
}
