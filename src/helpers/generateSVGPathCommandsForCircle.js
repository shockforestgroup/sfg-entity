function generateSVGPathCommandsForCircle({ radius, inverted }) {
  const f = 0.552;
  let curveSegment1, curveSegment2, curveSegment3, curveSegment4;
  if (inverted) {
    curveSegment1 = [
      `M0 ${-radius}`,
      `C-${f * radius} ${-radius}`,
      `${-radius} ${-f * radius}`,
      `${-radius} 0`,
    ].join(" ");
    curveSegment2 = [
      `M${-radius} 0`,
      `C${-radius} ${f * radius}`,
      `-${f * radius} ${radius}`,
      `0 ${radius}`,
    ].join(" ");
    curveSegment3 = [
      `M0 ${radius}`,
      `C${f * radius} ${radius}`,
      `${radius} ${f * radius}`,
      `${radius} 0`,
    ].join(" ");
    curveSegment4 = [
      `M${radius} 0`,
      `C${radius} ${-f * radius}`,
      `${f * radius} ${-radius}`,
      `0 ${-radius}`,
    ].join(" ");
  } else {
    curveSegment1 = [
      `M0 ${-radius}`,
      `C${f * radius} ${-radius}`,
      `${radius} ${-f * radius}`,
      `${radius} 0`,
    ].join(" ");
    curveSegment2 = [
      `M${radius} 0`,
      `C${radius} ${f * radius}`,
      `${f * radius} ${radius}`,
      `0 ${radius}`,
    ].join(" ");
    curveSegment3 = [
      `M0 ${radius}`,
      `C-${f * radius} ${radius}`,
      `${-radius} ${f * radius}`,
      `${-radius} 0`,
    ].join(" ");
    curveSegment4 = [
      `M${-radius} 0`,
      `C${-radius} ${-f * radius}`,
      `-${f * radius} ${-radius}`,
      `0 ${-radius}`,
    ].join(" ");
  }
  return `${curveSegment1}${curveSegment2}${curveSegment3}${curveSegment4}`;
}

export default generateSVGPathCommandsForCircle;
