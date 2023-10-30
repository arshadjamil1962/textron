import React from 'react'
import sentimentAnalysisImage from "../ImgComponents/sentimentanalysis.jpg"
import SentimentSlider from "./SentimentSlider"

function AppContentTextShowAnalysis(props) {

  function GrammarSpellFix() {
    let grammarSpellText = "<p>" + props.textContent.textContentGrammar + "</p>";
    return (
      <div dangerouslySetInnerHTML={{ __html: grammarSpellText }} />
    );
  }

  return (
    <div className="textAnalysisContainer">
      <h6>Content Anslysis</h6>
      <div className="textAnalysisArea">
        <h5>Spell And Grammar Fix</h5>
        <GrammarSpellFix />
        {/* <p>{props.textContent.textContentGrammar}</p> */}
      </div>
      <div className="textAnalysisflexArea">
        <div className="textAnalysisflexAreaItems">
          <h5>Sentiment Analysis</h5>
          <img className="sentimentAnalysisImage" src={sentimentAnalysisImage} alt="analysis" />
          <SentimentSlider sentiment={props.textContent.textContentSentiment} />
        </div>
        <div className="textAnalysisflexAreaItems">
          <h5>Named Entity Recognition (NER)</h5>
          <ul>
            {/* <p>{props.textContent.textContentNER}</p> */}
            {props.textContent.textContentNER.map((ner, index) => (
              <li key={index}>
                {ner}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="textAnalysisArea">
        <h5>Summary</h5>
        <p>{props.textContent.textContentSummary}</p>
      </div>
      <div className="textAnalysisArea">
        <h5>Rephrase</h5>
        <p>{props.textContent.textContentRephrase}</p>
      </div>
      <div className="textAnalysisArea">
        <h5>Contrast</h5>
        <p>{props.textContent.textContentContrast}</p>
      </div>
      <div className="textAnalysisArea">
        <h5>Translation in {props.textContent.textContentTranslateLang}</h5>
        <p>{props.textContent.textContentTranslate}</p>
      </div>

    </div>
  )
}

export default AppContentTextShowAnalysis
