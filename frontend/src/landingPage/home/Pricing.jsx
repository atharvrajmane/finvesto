import React from 'react';

function Pricing() {
    return ( 
        <div className="container px-5 pb-5">
            <div className="row px-5 pb-5">
                <div className="col-5 pb-5">
                <h1 className='pb-3 fs-2'>Unbeatable pricing</h1>
                <p>We pioneered the concept of discount broking and price transparency in India. Flat fees and no hidden charges.</p>
                <a href="" className="text-decoration-none">See pricing <i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <div className="col-7 d-flex pb-5">
                    <div className="col-4 d-flex mt-5">
                        <div className="col-8">
                            <img src="media/images/pricing-eq.svg" alt="Not Found" />
                        </div>
                        <div className="col-4 mt-5">
                            <p className="text-muted" style={{fontSize:"10px",marginLeft:"-25px"}}>Free account opening</p>
                        </div>
                    </div>
                    <div className="col-4 d-flex mt-5">
                        <div className="col-8">
                            <img src="media/images/pricing-eq.svg" alt="Not Found" />
                        </div>
                        <div className="col-4 mt-5">
                            <p className="text-muted" style={{fontSize:"10px",marginLeft:"-35px",marginRight:"-25px"}}> Free equity delivery <br />and direct mutual <br />funds</p>
                        </div>
                    </div>
                    <div className="col-4 d-flex mt-5">
                        <div className="col-8">
                            <img src="media/images/other-trades.svg" alt="Not Found" />
                        </div>
                        <div className="col-4 mt-5">
                            <p className="text-muted" style={{fontSize:"10px",marginLeft:"-15px"}}>Intraday and <br />F&O</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default Pricing;