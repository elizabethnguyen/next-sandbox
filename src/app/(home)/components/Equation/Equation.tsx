"use client";

import { useCallback, useState } from "react";
import "./equation.styles.css";

export function Equation() {
  const [leftCount, setLeftCount] = useState<number>(0);
  const [middleCount, setMiddleCount] = useState<number>(0);

  const updateLeftCount = useCallback(() => {
    setLeftCount(leftCount + 1);
  }, [leftCount]);

  const updateMiddleCount = useCallback(() => {
    setMiddleCount(middleCount + 1);
  }, [middleCount]);

  const totalCount = leftCount + middleCount;

  return (
    <>
      <div className="sample-box-left" onClick={updateLeftCount}>
        {leftCount}
      </div>
      +
      <div className="sample-box-middle" onClick={updateMiddleCount}>
        {middleCount}
      </div>
      =<div className="sample-box-right">{totalCount}</div>
    </>
  );
}
