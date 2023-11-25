import React from 'react'
import AppContentTexts from './AppContentTexts';
import emptyContentImage from "../ImgComponents/empty1.png";
import demoAdd from "../ImgComponents/unknown1.png"


function AppContentTextArea(props) {
  const demoText = {
    text2analyse: "IT is a global force that connects people, businesses, and governmnts, enabling rapid advancements in various fields. From Silicon Valley in the United States, which renowned for its tech innovation and entrepreneurship, to India, a global IT outsourcing hub, and Silicon Wadi in Israel, known for its vibrant tech start-up scene, IT hubs are scatered across the globe, each contributing to global digital landscape.",
    textContentDateTime: "demo text",//props.getContentDateTime(),
    textContentSummary: "IT is a global force, connecting people, businesses, and governments, with hubs like Silicon Valley, India, and Israel shaping the digital landscape.",
    textContentGrammar: "IT is a global force that connects people, businesses, and governments, enabling rapid advancements in various fields. From Silicon Valley in the United States, which is renowned for its tech innovation and entrepreneurship, to India, a global IT outsourcing hub, and Silicon Wadi in Israel, known for its vibrant tech start-up scene, IT hubs are scattered across the globe, each contributing to the global digital landscape.",
    textContentSentiment: '1.3',
    textContentNER: ["IT (ORGANIZATION)", "Silicon Valley (LOCATION)", "the United States (LOCATION)", "India (LOCATION)", "Silicon Wadi (LOCATION)", "Israel (LOCATION)"],
    textContentRephrase: "Information Technology (IT) serves as a worldwide catalyst, fostering connections between individuals, enterprises, and governments, thereby facilitating swift progress in diverse domains. This phenomenon is evident in IT hubs situated across the globe, including Silicon Valley's tech innovation, India's prominence as a global IT outsourcing hub, and Silicon Wadi's thriving tech start-up scene, all playing their part in shaping the global digital landscape.",
    textContentContrast: "In contrast, Information Technology (IT) is often viewed as a global disruptor, raising concerns about the potential disconnect between individuals, businesses, and governments. This phenomenon is particularly contentious in the case of IT hubs across the world, such as Silicon Valley's rapid technological advancements, India's expanding influence in the outsourcing industry, and Silicon Wadi's exponential growth in tech start-ups, all contributing to uncertainties about the evolving digital landscape on a global scale.",
    textContentCategory: "DEMO",
    textTranslationLang: "Japanese",
    textTranslation: "情報技術（IT）は、世界中の個人、企業、政府間のつながりを促進し、さまざまな分野で急速な進歩を可能にする世界的なカタリストとして機能しています。これは、シリコンバレーのテクノロジーイノベーション、世界的なITアウトソーシングハブとしてのインド、そしてテクノロジースタートアップの盛んなイスラエルのシリコンワディなど、世界中に存在するITハブに現れており、それぞれがグローバルなデジタルランドスケープの形成に寄与しています。"
  }

  var emptyContent = props.textContent.length === 0;

  function handleDemoContent() {
    props.onAdd(demoText);
  }

  return (
    <div className="textContentContainer" style={{ textAlign: "center" }}>
      <h6>Search history
        {emptyContent && <img src={demoAdd} alt="Empty Content" onClick={handleDemoContent} data-toggle="tooltip" data-placement="right" title="Add demo text" />}
      </h6>
      {emptyContent && <img src={emptyContentImage} alt="Empty Content" />}

      {props.textContent.map((contentItem, index) => {
        return (
          <AppContentTexts
            key={index}
            id={index}
            text2analyse={contentItem.text2analyse}
            textContentDateTime={contentItem.textContentDateTime}
            onDelete={props.deleteTextContent}
            onShow={props.showTextContent}
          />
        );
      })}
    </div>
  )
}

export default AppContentTextArea
