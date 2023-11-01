import React from "react";
import btnImage from "../ImgComponents/return2.jpg"

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
                <button  className="btnReturnTop" onClick={handleBackWay}>
                    <img className="btnImage" src={btnImage} alt="Return" />
                </button>
            </div>
        </div>
    );
}

export default AppContentTextShowArea
