function haveIntersection(r1, r2) {
  if (
    !r1.x ||
    !r2.x ||
    !r1.y ||
    !r2.y ||
    !r1.height ||
    !r2.height ||
    !r1.width ||
    !r2.width
  ) {
    return false;
  }
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

export default haveIntersection;
