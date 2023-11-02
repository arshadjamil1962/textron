import React, { useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppHeader } from './AppHeader'
import { AppFooter } from './AppFooter'
import AppContentTextCreateArea from "./AppContentTextCreateArea";
import AppContentTextArea from "./AppContentTextArea";
import AppContentTextShowArea from "./AppContentTextShowArea";
import AppContentTextShowAnalysis from "./AppContentTextShowAnalysis";
import AppError from "./AppError";

import OpenAI from "openai";

const openAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

function AppHome() {
  const year = new Date().getFullYear();

  const [textContent, setTextContent] = useState([
    {
      text2analyse: "IT is a global force that connects people, businesses, and governmnts, enabling rapid advancements in various fields. From Silicon Valley in the United States, which renowned for its tech innovation and entrepreneurship, to India, a global IT outsourcing hub, and Silicon Wadi in Israel, known for its vibrant tech start-up scene, IT hubs are scatered across the globe, each contributing to global digital landscape.",
      textContentDateTime: getContentDateTime(),
      textContentSummary: "IT is a global force, connecting people, businesses, and governments, with hubs like Silicon Valley, India, and Israel shaping the digital landscape.",
      textContentGrammar: "IT is a global force that connects people, businesses, and governments, enabling rapid advancements in various fields. From Silicon Valley in the United States, which is renowned for its tech innovation and entrepreneurship, to India, a global IT outsourcing hub, and Silicon Wadi in Israel, known for its vibrant tech start-up scene, IT hubs are scattered across the globe, each contributing to the global digital landscape.",
      textContentSentiment: '0.2',
      textContentNER: ["IT (ORGANIZATION)", "Silicon Valley (LOCATION)", "the United States (LOCATION)", "India (LOCATION)", "Silicon Wadi (LOCATION)", "Israel (LOCATION)"],
      textContentRephrase: "Information Technology (IT) serves as a worldwide catalyst, fostering connections between individuals, enterprises, and governments, thereby facilitating swift progress in diverse domains. This phenomenon is evident in IT hubs situated across the globe, including Silicon Valley's tech innovation, India's prominence as a global IT outsourcing hub, and Silicon Wadi's thriving tech start-up scene, all playing their part in shaping the global digital landscape.",
      textContentContrast: "In contrast, Information Technology (IT) is often viewed as a global disruptor, raising concerns about the potential disconnect between individuals, businesses, and governments. This phenomenon is particularly contentious in the case of IT hubs across the world, such as Silicon Valley's rapid technological advancements, India's expanding influence in the outsourcing industry, and Silicon Wadi's exponential growth in tech start-ups, all contributing to uncertainties about the evolving digital landscape on a global scale."
    }
  ]);

  const languageOptions = ["No Translation", "Arabic", "Bengali", "Chinese", "Danish", "Dutch", "French", "German", "Hindi", "Indonesian", "Italian", "Japanese", "Korean", "Mandarin", "No Translation", "Norwegian", "Portuguese", "Russian", "Spanish", "Swedish", "Turkish", "Urdu", "Vietnamese"];

  const [textContenet2Show, setTextContent2Show] = useState();

  const [showAnalysis, setShowAnalysis] = useState(false);

  const notifyAlert = (alertType, alertMessage, alertDelay = 1000) =>
    toast(alertMessage, {
      type: alertType,
      position: "top-center",
      autoClose: alertDelay,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      closeButton: false,
    });

  function getContentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const updatedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return updatedDateTime;
  }

  function addTextContent(newTextContent) {
    setTextContent(prevTextContent => {
      return [newTextContent, ...prevTextContent];
    });
  }

  function deleteTextContent(id) {
    setTextContent(prevTextContent => {
      return prevTextContent.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  function showTextContent(id) {
    // notifyAlert("Info", "Sample Analysis to Show", 5000);
    setShowAnalysis(true);
    const text2Show = textContent[id];
    setTextContent2Show(text2Show)
  }

  if (!openAI_API_KEY) {
    // console.log('Missing')
    // notifyAlert("error", "OpenAI API key not configured, please Check with Administrator");
    return (
      <div>
        <AppHeader />
        <AppError errorMessage={"OpenAI API key not configured, please Check with Administrator"} />
        <AppFooter AppYear={year} />
      </div>
    );
  }

  const openai = new OpenAI({
    apiKey: openAI_API_KEY, dangerouslyAllowBrowser: true,
  });

  return (
    <div className="appContainer">
      <ToastContainer />
      <AppHeader />
      {!showAnalysis && <AppContentTextCreateArea
        onAdd={addTextContent}
        notifyAlert={notifyAlert}
        openai={openai}
        getContentDateTime={getContentDateTime}
      />}

      {!showAnalysis && <AppContentTextArea
        textContent={textContent}
        deleteTextContent={deleteTextContent}
        showTextContent={showTextContent} />}

      {showAnalysis && <AppContentTextShowArea
        textContent={textContenet2Show}
        setShowAnalysis={setShowAnalysis} />}

      {showAnalysis && <AppContentTextShowAnalysis
        textContent={textContenet2Show}
        setShowAnalysis={setShowAnalysis}
        languageOptions={languageOptions}
        notifyAlert={notifyAlert}
        openai={openai} />}

      <AppFooter AppYear={year} />
    </div>
  )
}

export default AppHome
