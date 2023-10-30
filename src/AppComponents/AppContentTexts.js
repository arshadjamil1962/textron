import React from 'react'

function AppContentTexts(props) {
    const maxLength = 175;
    let textContent = props.text2analyse;
    if (textContent.length > maxLength) {
        textContent = textContent.substr(0, maxLength) + '...'
    }

    function handleDelete() {
        props.onDelete(props.id);
    }

    function handleShow() {
        props.onShow(props.id);
    }

    return (
        <div className="textContentArea">
            <p>{textContent}</p>
            <button className="btnAnalyse" onClick={handleShow}>ANALYSIS</button>
            <button className="btnDelete" onClick={handleDelete}>DELETE</button>
        </div>
    );
}

export default AppContentTexts
