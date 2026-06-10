// pages/MembershipPage.jsx
import MembershipForm from '../components/MembershipForm';

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