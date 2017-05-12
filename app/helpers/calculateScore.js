var score = 0;

 module.exports = (prediction, sensexValue) => {
  score = 0;
  const predictionInt = Math.floor(prediction);
  const sensexValueInt = Math.floor(sensexValue);

  if (Math.abs(predictionInt - sensexValueInt) <= 5 && Math.abs(sensexValueInt - predictionInt) >= 0 ) {
    score = score + 10;
    return checkDecimalScore(prediction, sensexValue)
  } else if (Math.abs(predictionInt - sensexValueInt) <= 10 && Math.abs(sensexValueInt - predictionInt) >= 0) {
    score = score + 8;
    return checkDecimalScore(prediction, sensexValue)
  } else if(Math.abs(predictionInt - sensexValueInt) <= 15 && Math.abs(sensexValueInt - predictionInt) >= 0) {
    score = score + 6;
    return checkDecimalScore(prediction, sensexValue)
  } else if(Math.abs(predictionInt - sensexValueInt) <= 20 && Math.abs(sensexValueInt - predictionInt) >= 0) {
    score = score + 4;
    return checkDecimalScore(prediction, sensexValue)
  } else if(Math.abs(predictionInt - sensexValueInt) <= 25 && Math.abs(sensexValueInt - predictionInt) >= 0) {
    score = score + 2;
    return checkDecimalScore(prediction, sensexValue);
  }
  return score;
}

var checkDecimalScore = (prediction, sensexValue) => {
  const predictionDecimal = prediction - Math.floor(prediction);
  const sensexValueDecimal = sensexValue - Math.floor(sensexValue);

  if (Math.abs(predictionDecimal - sensexValueDecimal) <= 0.01 && Math.abs(sensexValueDecimal - predictionDecimal) >= 0 ) {
    score = score + 10;
    console.log(predictionDecimal - sensexValueDecimal)
  } else if (Math.abs(predictionDecimal - sensexValueDecimal) <= 0.02 && Math.abs(sensexValueDecimal - predictionDecimal) >= 0) {
    score = score + 8;
  } else if (Math.abs(predictionDecimal - sensexValueDecimal) <= 0.03 && Math.abs(sensexValueDecimal - predictionDecimal) >= 0) {
    score = score + 6;
  } else if (Math.abs(predictionDecimal - sensexValueDecimal) <= 0.04 && Math.abs(sensexValueDecimal - predictionDecimal) >= 0) {
    score = score + 4;
  } else if (Math.abs(predictionDecimal - sensexValueDecimal) <= 0.05 && Math.abs(sensexValueDecimal - predictionDecimal) >= 0) {
    score = score + 2;
  }
  return score;
}
