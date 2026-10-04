'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Maximize2, Minus, Plus, Scan, X } from 'lucide-react';

const MIN_SCALE = 0.01;
const MAX_SCALE = 4;

type DiagramViewProps = {
  svg: string;
  width: number;
  expanded?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
};

function DiagramView({ svg, width, expanded = false, onExpand, onClose }: DiagramViewProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const zoomAnchorRef = useRef<{ x: number; y: number; diagramX: number; diagramY: number } | null>(null);
  const [scale, setScale] = useState<number | null>(expanded ? 1 : null);
  const scaleRef = useRef<number | null>(expanded ? 1 : null);

  const currentScale = () => {
    if (scaleRef.current !== null) return scaleRef.current;
    const viewport = viewportRef.current;
    return Math.min(1, Math.max(MIN_SCALE, ((viewport?.clientWidth ?? width + 32) - 32) / width));
  };

  const zoomTo = (next: number, clientX?: number, clientY?: number) => {
    const viewport = viewportRef.current;
    const diagram = diagramRef.current;
    const resolved = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    if (!viewport || !diagram || resolved === scaleRef.current) return;
    const viewportRect = viewport.getBoundingClientRect();
    const diagramRect = diagram.getBoundingClientRect();
    const anchorX = clientX ?? viewportRect.left + viewport.clientWidth / 2;
    const anchorY = clientY ?? viewportRect.top + viewport.clientHeight / 2;
    const displayedScale = diagramRect.width / width;
    zoomAnchorRef.current = {
      x: anchorX,
      y: anchorY,
      diagramX: (anchorX - diagramRect.left) / displayedScale,
      diagramY: (anchorY - diagramRect.top) / displayedScale,
    };
    scaleRef.current = resolved;
    setScale(resolved);
  };

  useLayoutEffect(() => {
    const anchor = zoomAnchorRef.current;
    const viewport = viewportRef.current;
    const diagram = diagramRef.current;
    if (!anchor || !viewport || !diagram || scale === null) return;
    const rect = diagram.getBoundingClientRect();
    viewport.scrollLeft += rect.left + anchor.diagramX * scale - anchor.x;
    viewport.scrollTop += rect.top + anchor.diagramY * scale - anchor.y;
    zoomAnchorRef.current = null;
  }, [scale]);

  const fitWidth = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    zoomAnchorRef.current = null;
    scaleRef.current = null;
    setScale(null);
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
  };

  useEffect(() => {
    if (!expanded) return;
    const view = viewRef.current;
    if (!view) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const delta =
        event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? view.clientHeight : 1);
      zoomTo(currentScale() * Math.exp(-delta * 0.0015), event.clientX, event.clientY);
    };
    view.addEventListener('wheel', onWheel, { passive: false });
    return () => view.removeEventListener('wheel', onWheel);
  });

  const buttonClass =
    'rounded p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-2 focus-visible:outline-fd-primary';

  return (
    <div ref={viewRef} className={`relative ${expanded ? 'h-full' : ''}`}>
      <div className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-lg border border-fd-border bg-fd-card/95 p-0.5 text-fd-foreground shadow-sm backdrop-blur-sm">
        <button type="button" aria-label="缩小图表" title="缩小" className={buttonClass} onClick={() => zoomTo(currentScale() / 1.25)}>
          <Minus size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button type="button" aria-label="放大图表" title="放大" className={buttonClass} onClick={() => zoomTo(currentScale() * 1.25)}>
          <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button type="button" aria-label="适应容器宽度" title="适应容器宽度" className={buttonClass} onClick={fitWidth}>
          <Scan size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        {expanded ? (
          <button type="button" aria-label="关闭图表" title="关闭" className={buttonClass} onClick={onClose}>
            <X size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" aria-label="弹窗查看图表" title="弹窗查看" className={buttonClass} onClick={onExpand}>
            <Maximize2 size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        )}
      </div>
      <div
        ref={viewportRef}
        role="region"
        aria-label="Mermaid 图表，可拖动或滚动查看"
        tabIndex={0}
        className={`overflow-auto p-4 focus-visible:outline-2 focus-visible:outline-fd-primary ${expanded ? 'flex h-full overscroll-contain' : ''}`}
        style={{
          cursor: 'grab',
          maxHeight: !expanded && scale !== null && scale > 1 ? 'min(70vh, 640px)' : undefined,
        }}
        onPointerDown={(event) => {
          if (event.pointerType === 'touch' || event.button !== 0) return;
          const viewport = event.currentTarget;
          dragRef.current = {
            x: event.clientX,
            y: event.clientY,
            left: viewport.scrollLeft,
            top: viewport.scrollTop,
          };
          viewport.setPointerCapture(event.pointerId);
          viewport.style.cursor = 'grabbing';
          event.preventDefault();
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag) return;
          event.currentTarget.scrollLeft = drag.left - (event.clientX - drag.x);
          event.currentTarget.scrollTop = drag.top - (event.clientY - drag.y);
        }}
        onPointerUp={(event) => {
          dragRef.current = null;
          event.currentTarget.style.cursor = 'grab';
        }}
        onPointerCancel={(event) => {
          dragRef.current = null;
          event.currentTarget.style.cursor = 'grab';
        }}
      >
        <div
          ref={diagramRef}
          className={`${expanded ? 'm-auto shrink-0' : 'mx-auto'} [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-none [&_svg]:w-full`}
          style={{ width: scale === null ? `min(100%, ${width}px)` : width * scale }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}

export function MermaidViewer({ svg, width }: { svg: string; width: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!modalOpen) {
      if (dialog.open) dialog.close();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const preventBackdropScroll = (event: WheelEvent) => {
      if (event.target === dialog) event.preventDefault();
    };
    document.body.style.overflow = 'hidden';
    dialog.addEventListener('wheel', preventBackdropScroll, { passive: false });
    dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.removeEventListener('wheel', preventBackdropScroll);
      if (dialog.open) dialog.close();
    };
  }, [modalOpen]);

  return (
    <>
      <figure className="mermaid-diagram not-prose my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card">
        <DiagramView svg={svg} width={width} onExpand={() => setModalOpen(true)} />
      </figure>
      <dialog
        ref={dialogRef}
        aria-label="Mermaid 图表放大查看"
        className="mermaid-dialog not-prose m-auto h-[min(92vh,900px)] w-[min(96vw,1440px)] max-h-none max-w-none overflow-hidden rounded-xl border border-fd-border bg-fd-card p-0 text-fd-foreground shadow-2xl backdrop:bg-black/70"
        onClose={() => setModalOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}
      >
        {modalOpen ? (
          <DiagramView svg={svg} width={width} expanded onClose={() => setModalOpen(false)} />
        ) : null}
      </dialog>
    </>
  );
}
