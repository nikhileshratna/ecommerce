import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import EditProfileDetails from '../components/BuyerEditDetails';
import { getUserDetails } from '../services/operations/profileAPI';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.profile);
  const { token } = useSelector(state => state.auth);

  const [openModal, setOpenModal] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState({});

  const fetchAdditionalDetails = async () => {
    if (!token) return;

    const response = await fetch(SummaryApi.showAdditionalDetails.url, {
      method: SummaryApi.showAdditionalDetails.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    if (response.ok) {
      setAdditionalDetails(responseData?.data ?? {});
    } else {
      console.error('Failed to fetch additional details:', responseData.message);
    }
  };

  useEffect(() => {
    if (token && !user) {
      dispatch(getUserDetails(token, navigate));
    }
  }, [dispatch, navigate, token, user]);

  useEffect(() => {
    fetchAdditionalDetails();
    if (user) {
      setAdditionalDetails(user.additionalDetails ?? {});
    }

  }, [user]);
  if (!user) {
    return <div className="flex items-center justify-center h-screen text-red-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-red-50">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-8">User Dashboard</h1>
        <div className="flex items-center bg-white shadow-md rounded-lg p-6 mb-8">
          <img 
            src={user.profilePic || localStorage.getItem('userProfilePic')} 
            alt="Profile" 
            className="w-24 h-24 rounded-full mr-6" 
          />
          <div>
            <h2 className="text-2xl font-semibold text-red-700">Name : {user.name}</h2>
            <p className="text-red-500">Email : {user.email}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-red-600 mb-4">Account Information</h3>
          <div className='flex gap-3'>
            <button className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'
             onClick={() => navigate('/orders')}
            >My Orders</button>
            <button className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'
             onClick={() => setOpenModal(true)}
            >Edit Details</button>
            <button className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'
             onClick={fetchAdditionalDetails}
            >Refresh</button>
          </div>
          <div className='flex flex-col gap-4 cursor-pointer' onClick={() => setOpenModal(true)}>
            <p className="text-red-700 mt-4"><strong>Address:</strong> {additionalDetails.address ?? "Please Add Address"}</p>
            <p className="text-red-700"><strong>Gender:</strong> {additionalDetails.gender ?? "Please Add Gender"}</p>
            <p className="text-red-700"><strong>Date of Birth:</strong> {additionalDetails.dateOfBirth ?? "Please Add Date of Birth"}</p>
            <p className="text-red-700"><strong>Contact Number:</strong> {additionalDetails.contactNumber ?? "Please Add Contact Number"}</p>
          </div>
        </div>
      </div>
      {
        openModal && <EditProfileDetails onClose={() => setOpenModal(false)} additionalDetails={additionalDetails} />
      }
    </div>
  );
};

export default UserDashboard;
