import React from 'react'

export const Popup = ({displayPopup, setDisplayPopup}) => {

  return (
    <div className="popup-wrapper">
      <div className="popup-frame">
        <h2>{displayPopup.title}</h2>
        <div className="popup-message">
          {displayPopup.text}
        </div>
        <div className="button-control" onClick={(e) => {e.preventDefault(); setDisplayPopup("")}}>
          <button>OK</button>
        </div>
      </div>
    </div>
  )
}
