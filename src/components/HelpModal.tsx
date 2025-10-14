import { useEffect, useRef, useState, type PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    id: string;
    title?: string;
    trigger?: string; // optional CSS selector; defaults to [data-target="{id}"]
}>;

export default function HelpModal({ id, title = "Help", trigger, children }: Props) {
    const [open, setOpen] = useState(false);
    const prevFocus = useRef<HTMLElement | null>(null);
    const closeBtn = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const sel = trigger ?? `[data-target="${id}"]`;
        const el = document.querySelector<HTMLElement>(sel);
        if (!el) return;
        const onClick = () => { prevFocus.current = el; setOpen(true); };
        el.addEventListener("click", onClick);
        return () => el.removeEventListener("click", onClick);
    }, [id, trigger]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (open) closeBtn.current?.focus();
        else prevFocus.current?.focus?.();
    }, [open]);

    if (!open) return null;

    return (
        <div id={id} role="dialog" aria-modal="true" aria-label={title} className="hm-wrap" onClick={() => setOpen(false)}>
            <div className="hm" onClick={(e) => e.stopPropagation()}>
                <div className="hm-head">
                    <h3>{title}</h3>
                    <button ref={closeBtn} className="hm-x" onClick={() => setOpen(false)} aria-label="Close">×</button>
                </div>
                <div className="hm-body">{children}</div>
            </div>
            <style>{`
        .hm-wrap{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:grid;place-items:center;padding:16px}
        .hm{width:min(680px,96vw);max-height:min(80vh,720px);overflow:auto;background:#fff;border:1px solid var(--border);border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
        .hm-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:.8rem 1rem;border-bottom:1px solid var(--border)}
        .hm-head h3{margin:0;font-size:1.05rem}
        .hm-x{width:28px;height:28px;border:1px solid var(--border);border-radius:8px;background:#fff;cursor:pointer}
        .hm-x:hover{background:#f6f6f6}
        .hm-x:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
        .hm-body{padding:1rem;color:#222;line-height:1.55}
      `}</style>
        </div>
    );
}
