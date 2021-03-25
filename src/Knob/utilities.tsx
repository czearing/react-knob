/**
 * Returns {@code false} if the input exceeds a specified min and max value.
 *
 * @param value the value to clamp
 * @param min the minimum value
 * @param max the maximum value
 */
export const clamp = (value, min, max) => {
  return value <= max + 1 && value >= min - 1 ? true : false;
};
