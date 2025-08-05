import React from 'react';

function Hero() {
    return ( 
        <div className='container p-4 mt-5 mb-5'>
            <div className='row text-center mt-5'>
                <img src="media/images/landing.png" alt="Not Fount" className='mb-5 px-auto mx-auto' style={{width:"65%"}}/>
                <h1 className='mt-5'>Invest in everything</h1>
                <p className='fs-5'>Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</p>
                <button className='p-2 btn btn-primary fs-5 mt-4 mb-5' style={{width:"15%",margin:"0 auto"}}>Sign up for free</button>
            </div>
        </div>
    );
}

export default Hero;