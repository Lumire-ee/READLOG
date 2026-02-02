import type { ReactNode } from "react";
import MainSymbol from "@/assets/main_symbol.svg";

type UserLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function UserLayout({
  title,
  subtitle,
  children,
  footer,
}: UserLayoutProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          {/* TODO(optional): 로고 클릭 시 "/"(홈)으로 이동 처리 */}
          <img
            src={MainSymbol}
            alt="Booklog"
            className="mx-auto mb-4 h-16 select-none"
          />
          <h1 className="typo-heading-lg text-text-primary">{title}</h1>
          {subtitle && (
            <p className="mt-2 typo-label-sm text-text-secondary">{subtitle}</p>
          )}
        </div>

        {/* Form/Card */}
        {children}

        {/* Footer */}
        {footer && <div className="w-full max-w-sm">{footer}</div>}
      </div>
    </div>
  );
}
