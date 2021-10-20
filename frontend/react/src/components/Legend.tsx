import { borderColorMap, colorMap } from "../utils/Colors";

function Legend() {
  return (
    <div className="legend">
      <h6 className="text-center">Legend</h6>
      Yes
      <div
        className="rectangle"
        style={{ background: borderColorMap.CONSTRUCTION }}
      ></div>
      No
      <div
        className="rectangle"
        style={{ background: borderColorMap.NOT_CONSTRUCTION }}
      ></div>
      Maybe
      <div
        className="rectangle"
        style={{ background: borderColorMap.POSSIBLE_CONSTRUCTION }}
      ></div>
      Duplicate
      <div
        className="rectangle"
        style={{ background: borderColorMap.DUPLICATE }}
      ></div>
      Unclassified
      <div
        className="rectangle"
        style={{ background: borderColorMap.UNCLASSIFIED }}
      ></div>
    </div>
  );
}

export default Legend;
