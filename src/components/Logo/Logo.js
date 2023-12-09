import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return (
        <div className='ma4 mt0' >
            <Tilt className='Tilt br2 shadow-2' options={{ max : 55 }} style={{ height: 150, width: 150}}>
                <div className='Tilt-inner pa1'>
                    <h1><img style={{paddingTop: '1px'}} alt='brain logo' src={brain}/></h1>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;