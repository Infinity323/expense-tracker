import { PointerEvent, useEffect, useRef, useState } from "react";

interface DragState {
  startX: number;
  startIndex: number;
  endIndex: number;
  width: number;
}

export function useTimeSeriesNavigation<T>(data: T[]) {
  const [range, setRange] = useState({
    startIndex: 0,
    endIndex: data.length - 1,
  });
  const [drag, setDrag] = useState<DragState>();
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRange({
      startIndex: 0,
      endIndex: data.length - 1,
    });
  }, [data.length]);

  const visibleData = data.slice(range.startIndex, range.endIndex + 1);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const onWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      if (data.length < 2) return;

      const currentCount = range.endIndex - range.startIndex + 1;
      const nextCount = Math.max(
        2,
        Math.min(
          data.length,
          Math.round(currentCount * (event.deltaY < 0 ? 0.8 : 1.25)),
        ),
      );
      if (nextCount === currentCount) return;

      const bounds = chart.getBoundingClientRect();
      const pointerPosition = Math.max(
        0,
        Math.min(1, (event.clientX - bounds.left) / bounds.width),
      );
      const anchorIndex =
        range.startIndex + pointerPosition * (currentCount - 1);
      const startIndex = Math.round(
        anchorIndex - pointerPosition * (nextCount - 1),
      );
      const clampedStartIndex = Math.max(
        0,
        Math.min(data.length - nextCount, startIndex),
      );

      setRange({
        startIndex: clampedStartIndex,
        endIndex: clampedStartIndex + nextCount - 1,
      });
    };

    chart.addEventListener("wheel", onWheel, { passive: false });
    return () => chart.removeEventListener("wheel", onWheel);
  }, [data.length, range.endIndex, range.startIndex]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (data.length < 2 || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({
      startX: event.clientX,
      startIndex: range.startIndex,
      endIndex: range.endIndex,
      width: event.currentTarget.clientWidth,
    });
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag || drag.width === 0) return;
    const visibleCount = drag.endIndex - drag.startIndex + 1;
    const indexShift = Math.round(
      ((drag.startX - event.clientX) / drag.width) * visibleCount,
    );
    const startIndex = Math.max(
      0,
      Math.min(data.length - visibleCount, drag.startIndex + indexShift),
    );
    setRange({
      startIndex,
      endIndex: startIndex + visibleCount - 1,
    });
  };

  const endDrag = () => setDrag(undefined);

  const reset = () => {
    setRange({
      startIndex: 0,
      endIndex: data.length - 1,
    });
    setDrag(undefined);
  };

  return {
    visibleData,
    reset,
    chartRef,
    isZoomed: range.startIndex !== 0 || range.endIndex !== data.length - 1,
    interactionProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onDoubleClick: reset,
      cursor: data.length < 2 ? "default" : drag ? "grabbing" : "grab",
    },
  };
}
