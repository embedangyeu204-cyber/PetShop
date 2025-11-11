import React from "react";
import VetSidebar from "../../../components/VetSidebar";
import ManageProfile from "../../customer/dashboard/ManageProfile";
import "../../customer/dashboard/ManageProfile.css";
import "../dashboard/VeterinarianDashboard.css";
import "./VeterinarianProfile.css";

function VeterinarianProfile() {
  return (
    <div className="vet-profile-page vet-dashboard">
      <VetSidebar activeId="profile" />

      <main className="vet-profile-main">
        <ManageProfile
          title="Manage personal profile"
          description="Update your professional contact details and preferences. Information here powers your bookings and notifications."
          showPetManagement={false}
        />
      </main>
    </div>
  );
}

export default VeterinarianProfile;
