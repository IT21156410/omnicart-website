import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { slides } from "../../utils/data";

const Slider = () => (
    <Carousel className='slider text-center' style={{ width: '100%' }}>
      {slides.map(slide => (
          <Carousel.Item key={slide.id}>
            <img
                src={slide.image}
                alt={slide.title}
                style={{ width: '100%', height: 'auto' }} // Ensure the image is full width
            />
            <Carousel.Caption className='texto text-success'>
              <h1 style={{ color: '#0066cc' }}>{slide.title}</h1>
              <p style={{ color: '#ffcc00' }}>{slide.content}</p>
            </Carousel.Caption>
          </Carousel.Item>
      ))}
    </Carousel>
);

export default Slider;
