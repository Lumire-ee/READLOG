import type { ReactNode } from "react";

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
          <h1 className="typo-heading-lg text-text-primary">{title}</h1>
          {subtitle && (
            <p className="mt-2 typo-label-sm text-text-secondary">
              {subtitle}
            </p>
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
