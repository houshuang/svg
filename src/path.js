export const drawPath =(startX, startY, endX, endY, offset = 10, orientation = 'vertical') => {
  var deltaX = (Math.max(startX, endX) - Math.min(startX, endX)) * 0.15;
  var deltaY = (Math.max(startY, endY) - Math.min(startY, endY)) * 0.15;
  // For further calculations whichever is the shortest distance.
  var delta = Math.min(deltaY, deltaX);
  // Set sweep-flag (counter/clockwise)
  var arc1 = 0; var arc2 = 1;

  if (orientation == "vertical") {
    var sigY = Math.sign(endY - startY);
    // If start element is closer to the top edge,
    // draw the first arc counter-clockwise, and the second one clockwise.
    if (startY < endY) {
      arc1 = 1;
      arc2 = 0;
    }
    // Draw the pipe-like path
    // 1. move a bit right, 2. arch, 3. move a bit down, 4.arch, 5. move right to the end
    return ("M" + startX + " " + startY +
      " H" + (startX + offset + delta) +
      " A" + delta + " " + delta + " 0 0 " + arc1 + " " + (startX + offset + 2 * delta) + " " + (startY + delta * sigY) +
      " V" + (endY - delta * sigY) +
      " A" + delta + " " + delta + " 0 0 " + arc2 + " " + (startX + offset + 3 * delta) + " " + endY +
      " H" + endX);
  } else {
    //Horizontal
    var sigX = Math.sign(endX - startX);
    // If start element is closer to the left edge,
    // draw the first arc counter-clockwise, and the second one clockwise.
    if (startX > endX) {
      arc1 = 1;
      arc2 = 0;
    }
    // Draw the pipe-like path
    // 1. move a bit down, 2. arch, 3. move a bit to the right, 4.arch, 5. move down to the end
    return("M" + startX + " " + startY +
      " V" + (startY + offset + delta) +
      " A" + delta + " " + delta + " 0 0 " + arc1 + " " + (startX + delta * sigX) + " " + (startY + offset + 2 * delta) +
      " H" + (endX - delta * sigX) +
      " A" + delta + " " + delta + " 0 0 " + arc2 + " " + endX + " " + (startY + offset + 3 * delta) +
      " V" + endY);
  }

}
