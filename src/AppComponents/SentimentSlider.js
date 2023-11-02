import React from 'react';

function SentimentSlider(props) {
  //rounding to neareast .5 step
  const sentimentValue = Math.round(props.sentiment * 2) / 2;
  const leftMargin = (46.75 + (17 * sentimentValue))+"%";

    return (
        <div>
          <input
            type="range"
            min="-2"
            max="2"
            step=".5"
            value={sentimentValue}
            readOnly
            className="sentimentAnalysisSlider"
          />
          <div className="sentimentAnalysisSliderValue" style={{marginLeft: leftMargin }}>{sentimentValue}</div>
        </div>
      );
    }

export default SentimentSlider;
