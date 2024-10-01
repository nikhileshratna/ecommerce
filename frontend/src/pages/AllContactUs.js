import React, { useEffect, useState } from 'react';
import SummaryApi from '../common'; // Assuming this contains the endpoint for fetching contacts

const AllContact = () => {
  const [allContact, setAllContact] = useState([]);

  const fetchAllContact = async () => {
    try {
      const response = await fetch(SummaryApi.allContact.url); // Assuming you have an endpoint for all contacts
      const dataResponse = await response.json();

      console.log("contact data", dataResponse);
      setAllContact(dataResponse?.data || []);
    } catch (error) {
      console.error('Error fetching contact data:', error);
    }
  };

  useEffect(() => {
    fetchAllContact();
  }, []);

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Contacts</h2>
      </div>

      {/** Contact details */}
      <div className='py-4'>
        {allContact.length === 0 ? (
          <p>No contacts available</p>
        ) : (
          <div className='flex flex-col gap-4'>
            {allContact.map((contact, index) => (
              <div key={index} className='p-4 border border-gray-300 rounded-md'>
                <p><strong>Name:</strong> {contact.name}</p>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Comment:</strong> {contact.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllContact;
