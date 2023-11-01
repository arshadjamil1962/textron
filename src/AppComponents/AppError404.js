import React from 'react'
import errorImg from '../ImgComponents/404-page-not-found.jpg'

function AppError404(props) {
  return (
    <div className='appErrorPage'>
      <img src={errorImg} alt='Error' />
      <h4>{props.errorMessage}</h4>
    </div>
  )
}

export default AppError404
