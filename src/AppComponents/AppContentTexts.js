import React from 'react'

function AppContentTexts(props) {
    const maxLength = 175;
    let textContent = props.text2analyse;
    let textDateTime = props.textContentDateTime;

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
            <h5>{textDateTime}</h5>
            <p>{textContent}</p>
            <button className="btnAnalyse" onClick={handleShow}>
                Text Analysis
            </button>
            <button className="btnDelete" onClick={handleDelete}>
                Delete
            </button>
        </div>
    );
}

export default AppContentTexts
