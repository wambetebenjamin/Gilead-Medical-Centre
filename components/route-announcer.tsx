"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function RouteAnnouncer() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");
  const initial = useRef(true);
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>("main h1");
    const label = heading?.textContent?.trim();
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    if (initial.current) initial.current = false;
    else setAnnouncement(label ? `Page loaded: ${label}` : "Page content updated.");
  }, [pathname]);
  return <div className="visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</div>;
}
