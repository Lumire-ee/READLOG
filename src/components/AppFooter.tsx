import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "@/shared/constants/contact";

export default function AppFooter() {
  return (
    <footer className="text-text-primary pt-4">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:text-sm">
        <div className="typo-label-sm flex gap-8">
          <Link to="/privacy-policy">개인정보 처리방침</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>문의하기</a>
        </div>
        <div className="typo-caption">
          <p>Contact: {CONTACT_EMAIL}</p>
        </div>
      </div>
    </footer>
  );
}
