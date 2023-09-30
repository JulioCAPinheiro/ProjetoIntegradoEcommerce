import React, { useState } from 'react';

export default function Alert(message, onClose){
    return(
        <div className='alert'>
            <p>{message}</p>
            <button onClick={onClose}>OK</button>
        </div>
    )
}