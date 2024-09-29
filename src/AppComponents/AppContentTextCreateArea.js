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
        event.preventDefault();
        const { name, value } = event.target;
        setTextContent(prevTextContent => {
            return {
                ...prevTextContent,
                [name]: value
            };
        });
    }

    function clearTextContent(event) {
        event.preventDefault();
        // console.log(textContent.text2analyse);
        setTextContent({ text2analyse: "" });
    };

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

        // const theSystemInstruction0 = `my objective is to check that the provided text is not a junk,
        //                 so check if the provided text can consider as a sentence.
        //                 I need a single word result: true or false`;

        // const model0 = props.geminiAPI.getGenerativeModel({
        //     model: "gemini-1.5-flash",
        //     systemInstruction: theSystemInstruction0,
        //     });

        const theSystemInstruction1 = `Analyze the provided text and return the following information in JSON format:
            {
            textContentGrammar: grammatically corrected content,
            textContentSummary: summary of the content,
            textContentNER: [
                entity1 (type1),
                entity2 (type2),
                // ... other entities
            ],
            textContentSentiment: -2.0 // Replace with the calculated sentiment score
            }`;
        const model1 = props.geminiAPI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: theSystemInstruction1,
            generationConfig: { responseMimeType: "application/json" }
        });

        const theSystemInstruction2 = `Analyze the provided text and return the following information in JSON format
            {
            textContentRephrase: rephrased text,
            textContentContrast: a contrasting perspective or content related to the given text starting with 'In Contrast,
            }`;
        const model2 = props.geminiAPI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: theSystemInstruction2,
            generationConfig: { responseMimeType: "application/json" }
        });

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

            // const result0 = await model0.generateContent(textContent.text2analyse);

            //            if (result0 && (result0.response.text()).toUpperCase() === 'TRUE') {
            if (1 == 1) {
                const results = await Promise.all([
                    apiCallWithRetry(() =>
                        model1.generateContent(textContent.text2analyse)
                    ),
                    apiCallWithRetry(() =>
                        model2.generateContent(textContent.text2analyse)
                    ),
                ]);

                // All API calls have completed successfully, and results are available.
                // Access the result data from the first API call
                const result1 = results[0];
                // console.log(result1.response.text());
                const result2 = results[1];
                // console.log(result2.response.text());

                const textAnalysisResult1 = JSON.parse(result1.response.text());
                const textAnalysisSummary = textAnalysisResult1.textContentSummary;
                const textAnalysisGrammar = textAnalysisResult1.textContentGrammar;
                const textAnalysisSentiment = textAnalysisResult1.textContentSentiment;
                const textAnalysisNER = textAnalysisResult1.textContentNER;

                // Access the result data from the second API call
                const textAnalysisResult2 = JSON.parse(result2.response.text());
                const textAnalysisRephrase = textAnalysisResult2.textContentRephrase;
                const textAnalysisContrast = textAnalysisResult2.textContentContrast;

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

                toast.success('Search History Updated with New Analysis !!!');

                setTextContent({ text2analyse: "" });

            } else {
                // Display an error toast if the first API call result is not as expected
                toast.error('Not a Valid Sentence !');
                // const theSystemInstruction0 = `Why its not a complete sentence.`;

                // const model0 = props.geminiAPI.getGenerativeModel({
                //     model: "gemini-1.5-flash",
                //     systemInstruction: theSystemInstruction0,
                //     });
                //     const result0 = await model0.generateContent(textContent.text2analyse);
                //     console.log(result0.response.text());              
            }
            clearInterval(intervalId);
            toast.dismiss(loadingToastId);
        } catch (error) {

            // Consider adjusting the error handling logic for your use case
            if (error.response) {
                console.error(error.response.status, error.response.data);
                props.notifyAlert("error", `Error with Response: ${error.response.status}+"${error.response.data}`, 5000);
            } else {
                console.error(`Error with API request: ${error.message}`);
                props.notifyAlert("error", `Error with API request: ${error.message}`, 5000);
            }
        } finally {
            // Clear the interval when the try-catch block is done
            clearInterval(intervalId);
            toast.dismiss(loadingToastId);
        }
    }

    // function FormInput() {
    //     return (<form className="formTextCreateArea">
    //         <textarea
    //             name="text2analyse"
    //             onChange={handleChange}
    //             value={textContent.text2analyse}
    //             placeholder="Enter text to analyze..."
    //             rows="3"
    //         />
    //         <button className="btnAdd" onClick={submitTextContent}>
    //             Add
    //         </button>
    //         <button className="btnClear" onClick={clearTextContent}>
    //             Clear
    //         </button>

    //     </form>);
    // }

    // function FormError() {
    //     return (<div className='errormsg'>
    //         <img src={errorImg} alt="errorImage" />
    //         <div>
    //             <h5>Analysis can not be performed as API Key is Missing!</h5>
    //             <h5>Contact Administrator.</h5>
    //             <h6>Click Icon next to "Search History" title to add Demo Text</h6>
    //         </div>
    //     </div>)
    // }

    return (
        <div>
            {/* {props.validAPIKeyRef && <FormInput />}
                {!props.validAPIKeyRef && <FormError />} */}
            {props.validAPIKeyRef && <form className="formTextCreateArea">
                <textarea
                    name="text2analyse"
                    onChange={handleChange}
                    value={textContent.text2analyse}
                    placeholder="Enter text to analyze..."
                    rows="3"
                />
                <button className="btnAdd" onClick={submitTextContent}>
                    Submit
                </button>
                <button className="btnClear" onClick={clearTextContent}>
                    Clear
                </button>

            </form>
            }

            {!props.validAPIKeyRef && <form className="formTextCreateArea">
                <div className='errormsg'>
                    <img src={errorImg} alt="errorImage" />
                    <div>
                        <h5>Analysis can not be performed as API Key is Missing!</h5>
                        <h5>Contact Administrator.</h5>
                        <h6>Click Icon next to "Search History" title to add Demo Text</h6>
                    </div>
                </div>
            </form>}
        </div>
    );
}

export default AppContentTextCreateArea
