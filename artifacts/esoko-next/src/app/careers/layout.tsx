import type { ReactNode } from "react";
import "./careers.css";
export default function CareersLayout({ children }: { children: ReactNode }) {
  return <div className="careers-site">
    {children}
  </div>;
}
