import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div>
            <p className='f3'>
                {'This magic brain will detect faces. Give it a try!'}
            </p>
            <div className='center'>
                <div className='form center pa4 br4 shadow-5'>
                    <input 
                        onChange= {onInputChange} 
                        className='f4 pa2 w-70 center br3' type="text" />
                    <button 
                        onClick= {onButtonSubmit} 
                        className='w-30 grow f4 link ph3 pv2 dib white bg-light-blue br3'>Detect</button>  
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;