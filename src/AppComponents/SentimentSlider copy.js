import React from 'react';

function SentimentSlider(props) {

  const leftMargin = (47 + (18.5 * props.sentiment))+"%";

    return (
        <div>
          <input
            type="range"
            min="-2"
            max="2"
            step=".5"
            value={props.sentiment}
            readOnly
            className="sentimentAnalysisSlider"
          />
          <div className="sentimentAnalysisSliderValue" style={{marginLeft: leftMargin }}>{props.sentiment}</div>
        </div>
      );
    }

export default SentimentSlider;
