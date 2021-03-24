import React from "react";
import { useConst } from "@fluentui/react-hooks";
import "./styles.css";

export const Knob = (props) => {
  const elementRef = React.useRef();
  const [value, setValue] = React.useState(0);
  const [angle, setAngle] = React.useState(0);

  const { className, min = 0, max = 100, ticks = 10 } = props;

  const internalState = useConst(() => ({
    knobX: 0,
    knobY: 0,
    radius: 0
  }));

  /**
   * Clamps the input if it exceeds a specified min or max value.
   *
   * @param {*} value
   * @param {*} min
   * @param {*} max
   */
  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, 0), max - min);
  };

  const onMouseMove = React.useCallback(
    (ev) => {
      let angle =
        (Math.atan2(
          internalState.knobY - ev.clientY,
          internalState.knobX - ev.clientX
        ) *
          180) /
          Math.PI -
        90;

      // if (clamp(angle, min, max)) {
      setAngle(angle);
      setValue(Math.floor(angle / ticks));
      // }
    },
    [internalState.knobX, internalState.knobY]
  );

  const onMouseUp = React.useCallback(
    (ev) => {
      document.removeEventListener("mousemove", onMouseMove, true);
      document.removeEventListener("mouseup", onMouseUp, true);
    },
    [onMouseMove]
  );

  const onMouseDown = React.useCallback(
    (ev) => {
      document.addEventListener("mousemove", onMouseMove, true);
      document.addEventListener("mouseup", onMouseUp, true);
    },
    [onMouseUp, onMouseMove]
  );

  React.useLayoutEffect(() => {
    let knobBoundaries = elementRef?.current?.getBoundingClientRect();

    internalState.radius = knobBoundaries.width / 2;
    internalState.knobX = knobBoundaries.x + internalState.radius;
    internalState.knobY = knobBoundaries.y + internalState.radius;
  }, [internalState]);

  return (
    <div className={className}>
      <i
        ref={elementRef}
        className="knob"
        onMouseDown={onMouseDown}
        style={{ transform: "rotate(" + angle + "deg)" }}
      />
      {angle}
      <p>{value}</p>
    </div>
  );
};
