// pages/MembershipPage.jsx
import React from 'react';
import MembershipForm from '../components/MembershipForm';
import Footer from '../components/Footer';

const MembershipPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Solo el formulario */}
      <div className="flex-grow">
        <MembershipForm />
      </div>
    </div>
  );
};

export default MembershipPage;