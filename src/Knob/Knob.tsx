import React from "react";
import { useConst } from "@fluentui/react-hooks";
import { clamp } from "./utilities";
import "./styles.css";

/*eslint-disable @typescript-eslint/no-unused-expressions */

export const Knob = (props) => {
  const elementRef = React.useRef();

  const {
    className,
    minAngle = 0,
    maxAngle = 270,
    initialAngle = 90,
    min = 0,
    max = 100,
    step = 10
  } = props;

  const [value, setValue] = React.useState(0);
  const [angle, setAngle] = React.useState(initialAngle);

  const internalState = useConst(() => ({
    knobX: 0,
    knobY: 0,
    radius: 0
  }));

  /**
   * Calculates the angle of the mouse's position
   * relative to this knob component.
   *
   * @param mouseX the mouses x coordinate
   * @param mouseY the mouses y coordinate
   */
  const calculateMouseAngle = React.useCallback(
    (mouseX: number, mouseY: number) => {
      let deg =
        (Math.atan2(
          internalState.knobY - mouseY,
          internalState.knobX - mouseX
        ) *
          180) /
          Math.PI -
        90;

      if (deg < 0) {
        deg += 360;
      }

      return deg % 360;
    },
    [internalState.knobX, internalState.knobY]
  );

  /**
   * Calculates the total percentage of how much the knob is
   * filled, given it's degrees.
   *
   * @param degrees the knobs degrees
   */
  const calculateKnobPercent = React.useCallback(
    (degrees) => {
      return degrees <= maxAngle
        ? Math.max(Math.min(1, degrees / maxAngle), 0)
        : +(degrees - maxAngle < (360 - maxAngle) / 2);
    },
    [maxAngle]
  );

  const onMouseMove = React.useCallback(
    (ev) => {
      let deg = calculateMouseAngle(ev.clientX, ev.clientY);
      let percent = calculateKnobPercent(Math.abs(deg - initialAngle));

      if (clamp(deg, minAngle, maxAngle)) {
        setAngle(deg);
        setValue((Math.floor(min + max * percent) / step) * step);
      }
    },
    [
      calculateMouseAngle,
      calculateKnobPercent,
      initialAngle,
      step,
      max,
      min,
      maxAngle,
      minAngle
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
