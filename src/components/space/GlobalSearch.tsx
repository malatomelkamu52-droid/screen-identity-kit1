import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { groupResults, searchSpace } from "@/lib/space-intel";
import type { SearchResult } from "@/lib/space-types";

export default function GlobalSearch({
  onSelect,
  autoFocus = false,
}: {
  onSelect: (result: SearchResult) => void;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchSpace(query), [query]);
  const groups = useMemo(() => groupResults(results), [results]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <label className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 transition-colors focus-within:border-gold/50">
        <Search size={15} className="text-muted-foreground" />
        <span className="sr-only">Universal search</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              const first = groups[0]?.[1]?.[0];
              if (first) onSelect(first);
            }
          }}
          placeholder="Search space objects, missions, planets…"
          className="w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </label>

      {open && query.trim().length >= 2 && (
        <div className="hud-scroll mt-2 max-h-[52vh] w-full overflow-y-auto rounded-xl border border-white/[0.08] bg-[#090d16]/90 shadow-2xl backdrop-blur-2xl">
          {groups.length === 0 && (
            <p className="px-3 py-6 text-center font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
              NO MATCHES IN CATALOG
            </p>
          )}
          {groups.map(([category, items]) => (
            <section key={category}>
              <h3 className="sticky top-0 bg-[#090d16]/95 px-3 py-1.5 font-mono text-[9px] tracking-[0.18em] text-gold backdrop-blur-md">
                {category}
              </h3>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] text-foreground">{item.label}</span>
                    <span className="block truncate text-[10px] text-muted-foreground">{item.detail}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[9px] tracking-[0.14em] text-gold/80">
                    {item.action.kind === "body" ? "SCENE" : "VIEW"}
                  </span>
                </button>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
