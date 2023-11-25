import React, { useState, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import errorImg from '../ImgComponents/error1.jpg'

function AppContentTextCreateArea(props) {

    const [textContent, setTextContent] = useState({
        text2analyse: ""
    });

    const inputThreshold = process.env.REACT_APP_INPUT_TRESHOLD || 1;

    const readyToGoRef = useRef(true);

    const [, setForceUpdate] = useState();

    async function apiCallWithRetry(apiCallFunction, maxRetries = 3, delayBetweenRetries = 5000) {
        try {
            const result = await apiCallFunction();
            return result;
        } catch (error) {
            if (maxRetries > 0 && isRateLimitError(error)) {
                toast.warn(`Rate limit exceeded. Retrying in ${delayBetweenRetries / 1000} seconds...`);
                await delay(delayBetweenRetries);
                return apiCallWithRetry(apiCallFunction, maxRetries - 1, delayBetweenRetries);
            } else {
                throw error;
            }
        }
    }

    function isRateLimitError(error) {
        // For OpenAI, you check if the error status is related to rate limiting
        return error.message.includes('429'); // Example: Check if code is 429 (Too Many Requests)
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setTextContent(prevTextContent => {
            return {
                ...prevTextContent,
                [name]: value
            };
        });
    }

    function submitTextContent(event) {
        event.preventDefault();

        const text2Check = textContent.text2analyse;

        if (!readyToGoRef.current) {
            props.notifyAlert("Info", "Sorry for Inconvenience! Analysis is yet to be Added", 2000);
            return false;
        }

        if (text2Check === "") {
            props.notifyAlert("warning", "😥 Missing Text Content");
            return false;
        }
        //checking the Input Treshhold
        // with the provided process.env.REACT_APP_INPUT_TREHSHOLD 
        //OR default of 10
        const wordsInput = text2Check.split(" ");
        if (wordsInput.length < inputThreshold) {
            props.notifyAlert("warning", "😥 Minimum of " + inputThreshold + " words Required!", 2000);
            return false;
        }

        getContentAnalysis();
        // // props.onAdd(textContentAnalysedRef.current);
        // props.notifyAlert("Info", "Get Analysed", 2000);
    }

    async function getContentAnalysis() {
        const chatMessage = [{
            "role": "system",
            "content": `my objective is to check that the provided text is not a junk,
                        so check if the provided text can consider as a sentence.
                        I need a single word result: true or false` }];
        let uM = chatMessage.push({ "role": "user", "content": textContent.text2analyse });

        const chatMessage1 = [{
            "role": "system",
            "content": `for the provided text content provide
                    " textContentGrammar: "grammatically corrected content",
                    " textContentSummary: summary of the content",
                    " textContentNER: Named Entity Recognition along with their type as a list with output of NER entity and type as ‘entity (type)’" and
                    " textContentSentiment: Please analyze the sentiment of the following text and provide a numerical score between -2 and +2, where -2 indicates a highly negative sentiment, 1 indicate normal negative sentiment, 0 indicates a neutral sentiment, 1 indicate a normal positive sentiment and 2 indicates a highly positive sentiment"
                    output as a json object:` }];
        let uM1 = chatMessage1.push({ "role": "user", "content": textContent.text2analyse });

        const chatMessage2 = [{
            "role": "system",
            "content": `for the provided text content provide
                    " textContentRephrase: rephrase the following text in a different way",
                    " textContentContrast: a contrasting perspective or content related to the given text starting with 'In Contrast,'"
                    output as a json object:` }];
        let uM2 = chatMessage2.push({ "role": "user", "content": textContent.text2analyse });

        // Show the initial loading toast
        const loadingToastId = toast.info('Analysing the Content ...', {
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
            // Start a 5-second interval to repeatedly show the loading toast
            intervalId = setInterval(() => {
                toast.update(loadingToastId, {
                    render: 'Analysing the Content ...', // Update the message
                });
            }, 5000);

            const response0 = await apiCallWithRetry(() =>
                props.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: chatMessage,
                    temperature: 0,
                    max_tokens: 256,
                })
            );

            if (response0 && (response0.choices[0].message.content).toUpperCase() === 'TRUE') {
                const responses = await Promise.all([
                    apiCallWithRetry(() =>
                        props.openai.chat.completions.create({
                            model: "gpt-3.5-turbo",
                            messages: chatMessage1,
                            temperature: 0,
                            max_tokens: 256,
                        })
                    ),
                    apiCallWithRetry(() =>
                        props.openai.chat.completions.create({
                            model: "gpt-3.5-turbo",
                            messages: chatMessage2,
                            temperature: 0,
                            max_tokens: 256,
                        })
                    ),
                ]);

                // All API calls have completed successfully, and responses are available.
                // Access the response data from the first API call
                const response1 = responses[0];
                // console.log(response1);
                const textAnalysisResponse1 = JSON.parse(response1.choices[0].message.content);
                const textAnalysisSummary = textAnalysisResponse1.textContentSummary;
                const textAnalysisGrammar = textAnalysisResponse1.textContentGrammar;
                const textAnalysisSentiment = textAnalysisResponse1.textContentSentiment;
                const textAnalysisNER = textAnalysisResponse1.textContentNER;
                // Access the response data from the second API call
                const response2 = responses[1];
                // console.log(response2);
                const textAnalysisResponse2 = JSON.parse(response2.choices[0].message.content);
                const textAnalysisRephrase = textAnalysisResponse2.textContentRephrase;
                const textAnalysisContrast = textAnalysisResponse2.textContentContrast;

                const textAnalysisDateTime = props.getContentDateTime();

                const analysedContent = {
                    ...textContent,
                    textContentDateTime: textAnalysisDateTime,
                    textContentSummary: textAnalysisSummary,
                    textContentGrammar: textAnalysisGrammar,
                    textContentSentiment: textAnalysisSentiment,
                    textContentNER: textAnalysisNER,
                    textContentRephrase: textAnalysisRephrase,
                    textContentContrast: textAnalysisContrast,
                    textContentCategory: "LIVE"
                }

                setForceUpdate(Math.random()); //to Re-Render After Ref Assignment

                props.onAdd(analysedContent);

                toast.success('Text Added to Search History !');

                setTextContent({
                    text2analyse: ""
                });

            } else {
                // Display an error toast if the first API call result is not as expected
                toast.error('Not a Valid Sentence !');
            }
            clearInterval(intervalId);
            toast.dismiss(loadingToastId);
        } catch (error) {

            // Consider adjusting the error handling logic for your use case
            if (error.response) {
                console.error(error.response.status, error.response.data);
                props.notifyAlert("error", `Error with Response: ${error.response.status}+"${error.response.data}`, 5000);
            } else {
                console.error(`Error with OpenAI API request: ${error.message}`);
                props.notifyAlert("error", `Error with OpenAI API request: ${error.message}`, 5000);
            }
        } finally {
            // Clear the interval when the try-catch block is done
            clearInterval(intervalId);
            toast.dismiss(loadingToastId);
        }
    }

    function FormInput() {
        return (<div>
            <textarea
                name="text2analyse"
                onChange={handleChange}
                value={textContent.text2analyse}
                placeholder="Enter text to analyze..."
                rows="3"
            />
            <button className="btnAdd" onClick={submitTextContent}>
                Add
            </button>

        </div>);
    }

    function FormError() {
        return (<div className='errormsg'>
            <img src={errorImg} alt="errorImage" />
            <div>
                <h5>Analysis can not be performed as OpenAI Key is Missing!</h5>
                <h5>Contact Administrator.</h5>
                <h6>Click Icon next to "Search history" title to add Demo Text</h6>
            </div>
        </div>)
    }
    return (
        <div>
            <form className="formTextCreateArea">
                {props.validAPIKeyRef && <FormInput />}
                {!props.validAPIKeyRef && <FormError />}
            </form>
        </div>
    );
}

export default AppContentTextCreateArea
