import React from "react";
import { Custom2DTempleMap } from "./Custom2DTempleMap";

export function TempleMap({
  currentPos,
  activeLandmark,
  onSelectLandmark,
}) {
  return (
    <Custom2DTempleMap
      currentPos={currentPos}
      activeLandmark={activeLandmark}
      onSelectLandmark={onSelectLandmark}
    />
  );
}
