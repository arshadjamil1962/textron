import React from 'react'
import AppContentTexts from './AppContentTexts';

function AppContentTextArea(props) {
  return (
    <div className="textContentContainer">
    <h6>Content's</h6>
    {props.textContent.map((noteItem, index) => {
      return (
        <AppContentTexts
          key={index}
          id={index}
          text2analyse={noteItem.text2analyse}
          onDelete={props.deleteTextContent}
          onShow={props.showTextContent}
        />
      );
    })}
  </div>
)
}

export default AppContentTextArea
