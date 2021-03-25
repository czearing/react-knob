import React from "react";
import { useConst } from "@fluentui/react-hooks";
import "./styles.css";

export const Knob = (props) => {
  const elementRef = React.useRef();
  const [value, setValue] = React.useState(0);
  const [angle, setAngle] = React.useState(props.initialAngle || 220);

  const {
    className,
    minAngle = 0,
    maxAngle = 360,
    initialAngle = 220,
    min = 0,
    max = 100,
    step = 10
  } = props;

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
      let percent = 0;
      let deg =
        (Math.atan2(
          internalState.knobY - ev.clientY,
          internalState.knobX - ev.clientX
        ) *
          180) /
          Math.PI -
        90;

      if (deg < 0) {
        deg = 360 + deg;
      }

      if (deg <= maxAngle) {
        percent = Math.max(Math.min(1, deg / maxAngle), 0);
      } else {
        percent = +(deg - maxAngle < (360 - maxAngle) / 2);
      }

      setAngle(deg);
      setValue((Math.floor(min + max * percent) / step) * step);
    },
    [
      step,
      initialAngle,
      internalState.knobX,
      internalState.knobY,
      max,
      min,
      maxAngle
    ]
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
