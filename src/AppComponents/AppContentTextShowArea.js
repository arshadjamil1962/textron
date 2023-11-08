import React from "react";

function AppContentTextShowArea(props) {

    function handleBackWay(event) {
        event.preventDefault()
        props.setShowAnalysis(false);
    }

    return (
        <div>
            <div className="contentTextShowArea">
                <h6>Original text</h6>
                <p>{props.textContent.text2analyse}</p>
                <button  className="btnReturnTop" onClick={handleBackWay}>
                    {/* <img className="btnImageBack" src={btnImage} alt="Return" /> */}
                    BACK
                </button>
            </div>
        </div>
    );
}

export default AppContentTextShowArea
