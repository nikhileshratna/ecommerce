import React, { useEffect, useState } from 'react';
import UploadCarousel from '../components/UploadCarousel';
import SummaryApi from '../common';
import CarouselCard from '../components/CarouselCard';


const AllCarousel = () => {
  const [openUploadCarousel, setOpenUploadCarousel] = useState(false);
  const [allCarousel, setAllCarousel] = useState([]);

  const fetchAllCarousel = async () => {
    const response = await fetch(SummaryApi.allCarousel.url);
    const dataResponse = await response.json();

    console.log('carousel data', dataResponse);
    setAllCarousel(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllCarousel();
  }, []);

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Carousel Items</h2>
        <button
          className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full'
          onClick={() => setOpenUploadCarousel(true)}
        >
          Upload Carousel
        </button>
      </div>

      {/** Display carousel items */}
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {allCarousel.map((carousel, index) => (
          <CarouselCard data={carousel} key={index + 'allCarousel'} fetchdata={fetchAllCarousel} />
        ))}
      </div>

      {/** Upload carousel component */}
      {openUploadCarousel && (
        <UploadCarousel onClose={() => setOpenUploadCarousel(false)} fetchData={fetchAllCarousel} />
      )}
    </div>
  );
};

export default AllCarousel;
