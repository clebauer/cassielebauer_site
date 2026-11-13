import { useEffect, useRef, useState } from "react";
import "./ResumeNav.css";

// find whatever actually scrolls: the page-content panel on desktop, the page on phones
function scroller(from) {
  let el = from.parentElement;
  while (el && el !== document.body && el !== document.documentElement) {
    const y = getComputedStyle(el).overflowY;
    if (y === "auto" || y === "scroll") return el;
    el = el.parentElement;
  }
  return document.scrollingElement;
}

// sections: [{ id, title }]. Each ResumeSection needs the matching id.
export default function ResumeNav({ sections }) {
  const navRef = useRef(null);
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const siteTop = document.querySelector(".site-top");
    const phone = window.matchMedia("(max-width: 768px)");
    const root = document.documentElement;

    // on phones the site header is sticky too, so this sits just under it,
    // and jumping to a section leaves room for both
    const place = () => {
      const stick = phone.matches && siteTop ? siteTop.offsetHeight : 0;
      nav.style.setProperty("--stick-top", `${stick}px`);
      root.style.setProperty("--resume-scroll-offset", `${stick + nav.offsetHeight + 8}px`);
    };

    // "you are here": the last section whose top has scrolled up under the nav
    const update = () => {
      const line = nav.getBoundingClientRect().bottom + 24;
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      // short last sections never reach the line, so the very bottom counts as the last one
      const sc = scroller(nav);
      if (sc && sc.scrollTop > 0 && sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4) {
        current = sections[sections.length - 1]?.id;
      }
      setActive(current);
    };

    const refresh = () => {
      place();
      update();
    };

    refresh();
    // scroll events don't bubble, so listen in the capture phase to catch any scroller
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", refresh);
    const ro = new ResizeObserver(refresh);
    ro.observe(nav);
    if (siteTop) ro.observe(siteTop);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", refresh);
      ro.disconnect();
      root.style.removeProperty("--resume-scroll-offset");
    };
  }, [sections]);

  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav className="resume-nav" ref={navRef} aria-label="resume sections">
      <ul>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={active === s.id ? "squiggle-title" : undefined}
              style={{ "--squiggle-color": `var(--color-${(i % 6) + 1})` }}
              aria-current={active === s.id ? "location" : undefined}
              onClick={(e) => go(e, s.id)}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}