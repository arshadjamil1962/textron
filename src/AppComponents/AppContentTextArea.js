import React from 'react'
import AppContentTexts from './AppContentTexts';

function AppContentTextArea(props) {
  return (
    <div className="textContentContainer">
    <h6>Content's History</h6>
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
