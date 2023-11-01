import React from 'react'
import errorImg from '../ImgComponents/error1.jpg'

function AppError(props) {
  return (
    <div className='appErrorPage'>
      <img src={errorImg} alt='Error' />
      <h4>{props.errorMessage}</h4>
    </div>
  )
}

export default AppError
