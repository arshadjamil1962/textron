import React, { useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppHeader } from './AppHeader'
import { AppFooter } from './AppFooter'
import AppContentTextCreateArea from "./AppContentTextCreateArea";
import AppContentTextArea from "./AppContentTextArea";
import AppContentTextShowArea from "./AppContentTextShowArea";
import AppContentTextShowAnalysis from "./AppContentTextShowAnalysis";

function AppHome() {
  const year = new Date().getFullYear();

  const [textContent, setTextContent] = useState([
    // { text2analyse: "We use an RGB version of our --bs-success (with the value of 25, 135, 84) CSS variable and attached a second CSS variable, --bs-bg-opacity, for the alpha transparency (with a default value 1 thanks to a local CSS variable). That means anytime you use .bg-success now, your computed color value is rgba(25, 135, 84, 1). The local CSS variable inside each .bg-* class avoids inheritance issues so nested instances of the utilities don’t automatically have a modified alpha transparency." },
    // { text2analyse: "We use an RGB version of our --bs-success (with the value of 25, 135, 84) CSS variable and attached a second CSS variable, --bs-bg-opacity, for the alpha transparency (with a default value 1 thanks to a local CSS variable). That means anytime you use .bg-success now, your computed color value is rgba(25, 135, 84, 1). The local CSS variable inside each .bg-* class avoids inheritance issues so nested instances of the utilities don’t automatically have a modified alpha transparency." },
    {
      text2analyse: "IT is a global force that connects people, businesses, and governmnts, enabling rapid advancements in various fields. From Silicon Valley in the United States, which renowned for its tech innovation and entrepreneurship, to India, a global IT outsourcing hub, and Silicon Wadi in Israel, known for its vibrant tech start-up scene, IT hubs are scatered across the globe, each contributing to global digital landscape.",
      textContentSummary: "IT is a global force, connecting people, businesses, and governments, with hubs like Silicon Valley, India, and Israel shaping the digital landscape.",
      textContentGrammar: "IT is a global force that connects people, businesses, and <span class='spellDiff'>governments</span>, enabling rapid advancements in various fields. From Silicon Valley in the United States, which <span class='spellDiff'>is</span> renowned for its tech innovation and entrepreneurship, to India, a global IT outsourcing hub, and Silicon Wadi in Israel, known for its vibrant tech start-up scene, IT hubs are <span class='spellDiff'>scattered</span> across the globe, each contributing to <span class='spellDiff'>the</span> global digital landscape.",
      textContentSentiment: '1',
      textContentNER: ["IT (ORGANIZATION)", "Silicon Valley (LOCATION)", "the United States (LOCATION)", "India (LOCATION)", "Silicon Wadi (LOCATION)","Israel (LOCATION)"],
      textContentRephrase: "Information Technology (IT) serves as a worldwide catalyst, fostering connections between individuals, enterprises, and governments, thereby facilitating swift progress in diverse domains. This phenomenon is evident in IT hubs situated across the globe, including Silicon Valley's tech innovation, India's prominence as a global IT outsourcing hub, and Silicon Wadi's thriving tech start-up scene, all playing their part in shaping the global digital landscape.",
      textContentContrast: "In contrast, Information Technology (IT) is often viewed as a global disruptor, raising concerns about the potential disconnect between individuals, businesses, and governments. This phenomenon is particularly contentious in the case of IT hubs across the world, such as Silicon Valley's rapid technological advancements, India's expanding influence in the outsourcing industry, and Silicon Wadi's exponential growth in tech start-ups, all contributing to uncertainties about the evolving digital landscape on a global scale.",
      textContentTranslateLang: "Japanese",
      textContentTranslate: "情報技術（IT）は、世界中の個人、企業、政府間のつながりを促進し、さまざまな分野で急速な進歩を可能にする世界的なカタリストとして機能しています。これは、シリコンバレーのテクノロジーイノベーション、世界的なITアウトソーシングハブとしてのインド、そしてテクノロジースタートアップの盛んなイスラエルのシリコンワディなど、世界中に存在するITハブに現れており、それぞれがグローバルなデジタルランドスケープの形成に寄与しています。"
    }
  ]);

  const languageOptions = [    "No Translation", "Arabic",    "Bengali",    "Chinese",    "Danish",    "Dutch",    "French",    "German",    "Hindi",    "Indonesian",    "Italian",    "Japanese",    "Korean",    "Mandarin",    "No Translation",    "Norwegian",    "Portuguese",    "Russian",    "Spanish",    "Swedish",    "Turkish",    "Urdu",    "Vietnamese"];  

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

  function addTextContent(newTextContent) {
    setTextContent(prevTextContent => {
      return [newTextContent, ...prevTextContent ];
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
    notifyAlert("Info", "Sample Analysis to Show", 5000);
    setShowAnalysis(true);
    const text2Show = textContent[id];
    setTextContent2Show(text2Show)
  }

  return (
    <div className="appContainer">
      <ToastContainer />
      <AppHeader />
      {!showAnalysis && <AppContentTextCreateArea onAdd={addTextContent} notifyAlert={notifyAlert} languageOptions={languageOptions}/>}
      {!showAnalysis && <AppContentTextArea textContent={textContent} deleteTextContent={deleteTextContent} showTextContent={showTextContent} />}
      {showAnalysis && <AppContentTextShowArea textContent={textContenet2Show} setShowAnalysis={setShowAnalysis} />}
      {showAnalysis && <AppContentTextShowAnalysis textContent={textContenet2Show} />}
      <AppFooter AppYear={year} />
    </div>
  )
}

export default AppHome
