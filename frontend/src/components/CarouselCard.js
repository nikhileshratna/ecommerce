import React from 'react';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const CarouselCard = ({ data, fetchdata }) => {
  const handleDeleteCarousel = async () => {
    try {
      const response = await fetch(`${SummaryApi.deleteCarousel.url}/${data._id}`, {
        method: SummaryApi.deleteCarousel.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData.message);
        fetchdata(); // Refetch carousel items after deletion
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error('Failed to delete carousel item.');
    }
  };

  return (
    <div className="relative border rounded-lg shadow-md overflow-hidden w-[300px] h-[200px]">
      <img
        src={data.imageUrl}
        alt={data.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 bg-black bg-opacity-40 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <div className="text-center">
          <h3 className="text-white font-semibold">{data.title}</h3>
          <button
            className="mt-2 bg-red-600 text-white py-1 px-3 rounded-full hover:bg-red-700"
            onClick={handleDeleteCarousel}
          >
            <MdDelete className="inline-block mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;
