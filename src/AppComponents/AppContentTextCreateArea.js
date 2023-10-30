import React, { useState, useRef } from "react";
// import OpenAI from "openai";
// import { toast } from 'react-toastify';

// const openai = new OpenAI({
//     apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true,
// });

let userPrompt = 'IT is a global force that connects people, businesses, and governmnts, enabling rapid advancements in various fields. From Silicon Valley in the United States, which renowned for its tech innovation and entrepreneurship, to India, a global IT outsourcing hub, and Silicon Wadi in Israel, known for its vibrant tech start-up scene, IT hubs are scatered across the globe, each contributing to global digital landscape.';

let chatMessage1 = [];
let chatMessage2 = [];
let chatMessage3 = [];
let chatMessage4 = [];


function AppContentTextCreateArea(props) {

    const [textContent, setTextContent] = useState({
        text2analyse: "",
        textContentTranslateLang: "No Translation"
    });

    const textContentAnalysedRef = useRef([]);

    const readyToGoRef = useRef(true);

    const responseInErrorRef = useRef(false);

    const [, setForceUpdate] = useState();

    function handleChange(event) {
        const { name, value } = event.target;
        setTextContent(prevTextContent => {
            return {
                ...prevTextContent,
                [name]: value
            };
        });
    }

    function initializeChatMessages() {
 
        chatMessage1 = [{
            "role": "system",
            "content": `for the provided text content provide
                    " textContentGrammar: "grammatically corrected content",
                    " textContentSummary: summary of the content",
                    " textContentNER: Named Entity Recognition along with their type as a list with output of NER entity and type as ‘entity (type)’" and
                    " textContentSentiment: Please analyze the sentiment of the following text and provide a numerical score between -2 and +2, where -2 indicates a highly negative sentiment, 1 indicate normal negative sentiment, 0 indicates a neutral sentiment, 1 indicate a normal positive sentiment and 2 indicates a highly positive sentiment"
                    output as a json object:` }];

        chatMessage2 = [{
            "role": "system",
            "content": `for the provided text content provide
                    " textContentRephrase: rephrase the following text in a different way",
                    " textContentContrast: a contrasting perspective or content related to the given text starting with 'In Contrast,'"
                    output as a json object:` }];

        chatMessage3 = [{
            "role": "system",
            "content": `for the provided text content provide
                    " textContentTranslate: translation of content in `+textContent.textContentTranslateLang+`" and output as json object:` }];

        chatMessage4 = [{
            "role": "system",
            "content": `You are a creative assistant that generates ideas.`
        }];

    }

    function submitTextContent(event) {
        event.preventDefault();
        if (textContent.text2analyse === "") {
            props.notifyAlert("warning", "😥 You Missed out the Text Content");
            return
        }
        if (!readyToGoRef.current) {
            props.notifyAlert("Info", "Sorry for Inconvenience! Analysis is yet to be Added", 2000);
        } else {
            getContentAnalysis();

            if (!responseInErrorRef.current) {
                props.onAdd(textContentAnalysedRef.current);
            } else {
                props.notifyAlert("error", "😥 Something is Wrong. Please Try Again!");
            }
        }

        setTextContent({
            text2analyse: "",
            textContentTranslateLang: "No Translation"
        });
    }

    async function getContentAnalysis() {
        let textContentSummary = "Summary";
        let textContentGrammar = "Grammer";
        let textContentSentiment = "0";
        let textContentNER = ["NER (Location)"];
        let textContentRephrase = "Rephrase";
        let textContentContrast = "Contrast";
        let textContentTranslate = "Translate";

        props.notifyAlert("Info", "Analysing", 1000);
        initializeChatMessages()
        if (!responseInErrorRef.current) {

            const analysedContent = {
                ...textContent,
                textContentSummary: textContentSummary,
                textContentGrammar: textContentGrammar,
                textContentSentiment: textContentSentiment,
                textContentNER: textContentNER,
                textContentRephrase: textContentRephrase,
                textContentContrast: textContentContrast,
                textContentTranslate: textContentTranslate
            }

            textContentAnalysedRef.current = analysedContent;
            setForceUpdate(Math.random()); //to Re-Render After Ref Assignment
        }
        // toast.dismiss();
    }

    function TranslateLang() {
        return (
            <>
                <label>
                    Translate Into:
                    <select name="textContentTranslateLang"
                        value={textContent.textContentTranslateLang}
                        onChange={handleChange}>
                        {props.languageOptions.map((lang, index) => (
                            <option key={index} value={lang}>{lang}</option>
                        ))}
                    </select>
                </label>
            </>
        )
    }


    return (
        <div>
            <form className="formTextCreateArea">
                <textarea
                    name="text2analyse"
                    onChange={handleChange}
                    value={textContent.text2analyse}
                    placeholder="Enter Text Content to Analyse..."
                    rows="3"
                />
                <TranslateLang />
                <button className="btnAdd" onClick={submitTextContent}>Add</button>
            </form>
        </div>
    );
}

export default AppContentTextCreateArea
