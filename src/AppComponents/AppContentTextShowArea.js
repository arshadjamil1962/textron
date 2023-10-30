import React from "react";

function AppContentTextShowArea(props) {

    function handleBackWay(event) {
        event.preventDefault()
        props.setShowAnalysis(false);
    }

    return (
        <div>
            <div className="contentTextShowArea">
                <h6>Text Content</h6>
                <p>{props.textContent.text2analyse}</p>
                <button className="btnReturn" onClick={handleBackWay}>RETURN</button>
            </div>
        </div>
    );
}

export default AppContentTextShowArea
