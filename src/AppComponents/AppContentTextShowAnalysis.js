import React, { useState, useRef } from 'react'
import sentimentAnalysisImage from "../ImgComponents/sentimentanalysis.jpg"
import SentimentSlider from "./SentimentSlider"
import btnImage from "../ImgComponents/return2.jpg"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContentTextShowAnalysis(props) {
  const translationLangRef = useRef('No Translation');
  const translationRef = useRef("Test Translation");
  const showTranslationRef = useRef(false);

  const [, setForceUpdate] = useState();

  function handleBackWay(event) {
    event.preventDefault()
    props.setShowAnalysis(false);
  }

  function words(s) {
    // return s.match(/\w+/g);
    return s.split(" ");
  }

  function highlight(str, id, res) {
    var text = "";
    for (var i = 0; i < str.length; i++) {
      var hasVal = res.includes(str[i]);
      if (hasVal) {
        text += " <span class='spellDiff'>" + str[i] + "</span> ";
      } else {
        text += " " + str[i] + " ";
      }
    }
    return "<p>" + text + "</p>";
  }

  function GrammarSpellFix() {
    var str1 = props.textContent.text2analyse;
    var str2 = props.textContent.textContentGrammar;
    let a = words(str1);
    let b = words(str2);
    let res1 = b.filter(i => !a.includes(i));
    let grammarSpellText = highlight(b, "str2", res1);
    // let grammarSpellText = "<p>" + props.textContent.textContentGrammarFix + "</p>";
    grammarSpellText = "<p>" + grammarSpellText + "</p>";
    return (
      <div dangerouslySetInnerHTML={{ __html: grammarSpellText }} />
    );
  }

  function handleTranslation(e) {
    translationLangRef.current = e.target.value;
    if (translationLangRef.current !== 'No Translation') {
      fetchTranslationResponses();
    } else {
      showTranslationRef.current = false;
    }
    setForceUpdate(Math.random()); //to Re-Render After Ref Assignment
  }

  async function fetchTranslationResponses() {
    const chatTranslationMessage = [{
      "role": "system",
      "content": `for the provided text content translate content in ` + translationLangRef.current
    }];
    let uM2 = chatTranslationMessage.push({ "role": "user", "content": props.textContent.textContentGrammar });
    // Show the initial loading toast
    const loadingToastId = toast.info('Translation in progress...', {
      autoClose: 5000,
      closeOnClick: false,
      draggable: true,
      pauseOnHover: false,
      progress: undefined,
      theme: "light",
      closeButton: false,
    });

    let intervalId; // To keep track of the interval

    try {
      // Start a 1-second interval to repeatedly show the loading toast
      intervalId = setInterval(() => {
        toast.update(loadingToastId, {
          render: 'Translation in progress...', // Update the message
        });
      }, 5000);
      const responses = await
        props.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: chatTranslationMessage,
          temperature: 0,
          max_tokens: 256,
        });

      const textContentResponse = responses.choices[0].message.content;
      translationRef.current = textContentResponse;

      clearInterval(intervalId);
      toast.dismiss(loadingToastId);
      showTranslationRef.current = true;
      setForceUpdate(Math.random()); //to Re-Render After Ref Assignment
    } catch (error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        props.notifyAlert("error", `Error with Response: ${error.response.status}+"${error.response.data}`, 5000);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        props.notifyAlert("error", `Error with OpenAI API request: ${error.message}`, 5000);
      }
      clearInterval(intervalId);
      toast.dismiss(loadingToastId);
    }
  }

  function TranslateLang() {
    return (
      <div className="translationLangArea">
        <label>
          Translate Into:
          <select className="translationLangSelect"
            name="translationLang"
            value={translationLangRef.current}
            onChange={handleTranslation}>
            {props.languageOptions.map((lang, index) => (
              <option key={index} value={lang}>{lang}</option>
            ))}
          </select>
        </label>
      </div>
    )
  }

  function TranslationArea() {
    return (
      <div className="textAnalysisArea" style={{backgroundColor:"aliceblue"}}>
        <h5>Translation in {translationLangRef.current}</h5>
        {/* <p>{props.textContent.textContentTranslate}</p> */}
        <p>{translationRef.current}</p>
      </div>
    )
  }

  return (
    <div className="textAnalysisContainer">
      <div className="textAnalysisContainerHeader">
        <h6>Content Anslysis</h6>
        <TranslateLang />
      </div>

      {showTranslationRef.current && <TranslationArea />}

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

      <button className="btnReturnBottom" onClick={handleBackWay}>
        <img className="btnImage" src={btnImage} alt="Return" />
      </button>

    </div>
  )
}

export default AppContentTextShowAnalysis
