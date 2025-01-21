import React from "react";
import Carousel from 'react-bootstrap/Carousel';

function HomeCarousel() {
  return (
    <Carousel indicators={true}>
      <Carousel.Item>
        <div className="carousel-home d-flex justify-content-center align-items-center">
          <h3 className='home-header'>Welcome to <strong className='text-p-2'>Nestlé Sync Box</strong>🤩</h3>
          <ul className='text-p-1'>
            <li>Automated content convertion into a CMS-friendly format</li>
            <li>Live comparison between uploded and live content</li>
            <li>Highlighted error identification</li>
            <li>SEO data checkers</li>
          </ul>
          <p><strong className='text-p-2'>Choose which tool</strong> you would like to use for the project.</p>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-home d-flex justify-content-center align-items-left">
          <h3>Matrix Mirror</h3>
          <ol className='text-p-1'>
            <li>Enable the Api</li>
            <li>Select the type of content</li>
            <li>Choose a matrix file</li>
            <li>Submit the matrix's URL</li>
          </ol>
          <p>Click on<strong className='text-p-2'> Matrix Mirror</strong> in the tools panel to the right, then select the brand project to get started.</p>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-home d-flex justify-content-center align-items-left">
          <h3>URL Status Checker</h3>
          <p className='text-p-1'>Enter the article URL then submit</p>
          <ul className='text-p-1'>
            <li>Live Https Status and Redirect Checker</li>
          </ul>
          <p>Click on <strong className='text-p-2'>URL Status Checker</strong> in the tools panel to the right, to get started.</p>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-home d-flex justify-content-center align-items-left">
          <h3>MetaData Checker</h3>
          <p className='text-p-1'>Enter the article URL then submit</p>
          <ul className='text-p-1'>
            <li>Live Meta Title, Meta Description and URL lenght</li>
            <li>Live characters per text and validation</li>
          </ul>
          <p>Click on <strong className='text-p-2'>MetaData Checker </strong>in the tools panel to the right, then select the brand project to get started.</p>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default HomeCarousel;