import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiInfo } from "react-icons/fi";
import VetSidebar from "../../../components/VetSidebar";
import "../dashboard/VeterinarianDashboard.css";
import "./CreatePrescription.css";

const patient = {
  name: "Mocha",
  owner: "Anna Lee",
  species: "Dog",
  age: "3y",
  weight: "12.4 kg",
  allergies: "None",
  avatar: "https://i.pravatar.cc/80?img=5",
  appointment: "Mocha (AN-2031)",
};

const recentVisits = [
  {
    title: "Today • SOAP completed",
    description: "Plan: Hydroxyzine, shampoo, recheck 10 days",
  },
  {
    title: "Last month • Annual check",
    description: "Vaccines up to date",
  },
];

const medicationHistory = [
  {
    title: "Hydroxyzine 10 mg • 1 tab BID • 14 qty",
    status: "Completed",
  },
  {
    title: "Medicated shampoo • 2-3x/week",
    status: "Ongoing",
  },
];

const initialItems = [
  {
    id: "hydroxyzine",
    name: "Hydroxyzine",
    dosage: "10 mg",
    form: "Tablet",
    directions: "1 tab BID",
    duration: "14 qty",
  },
  {
    id: "shampoo",
    name: "Medicated shampoo",
    dosage: "Use 2-3x/week",
    form: "Topical",
    directions: "—",
    duration: "1 bottle",
  },
];

function CreatePrescription() {
  const navigate = useNavigate();
  const [items] = useState(initialItems);

  return (
    <div className="vet-prescription-page vet-dashboard">
      <VetSidebar activeId="prescriptions" />

      <main className="prescription-main">
        <header className="prescription-header">
          <div>
            <p className="eyebrow">Create prescription</p>
            <h1>Fill in medication details for the selected pet.</h1>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="pill-button ghost"
              onClick={() => navigate("/vet-dashboard")}
            >
              <FiArrowLeft aria-hidden="true" />
              Back to dashboard
            </button>
            <button type="button" className="pill-button soft">
              Prescription history
            </button>
          </div>
        </header>

        <section className="prescription-grid">
          <div className="patient-card">
            <div className="patient-header">
              <div className="patient-info">
                <img src={patient.avatar} alt={patient.name} />
                <div>
                  <strong>{patient.name}</strong>
                  <span>
                    {patient.species} • {patient.age}
                  </span>
                  <span>
                    Owner: {patient.owner} • Weight: {patient.weight}
                  </span>
                  <span>Allergies: {patient.allergies}</span>
                </div>
              </div>
              <button type="button" className="pill-button ghost">
                Visit: Today • 10:30
              </button>
            </div>

            <div className="patient-form">
              <label>
                <span>Select pet</span>
                <select defaultValue={patient.appointment}>
                  <option>{patient.appointment}</option>
                </select>
              </label>
              <label>
                <span>Related appointment</span>
                <select defaultValue="Walk-in visit">
                  <option>Walk-in visit</option>
                  <option>Follow-up</option>
                </select>
              </label>
              <button type="button" className="pill-button ghost">
                View medical record
              </button>
            </div>
          </div>

          <div className="medication-card">
            <h3>Medication details</h3>
            <div className="medication-form">
              <label>
                <span>Search medication</span>
                <input defaultValue="Hydroxyzine" />
              </label>
              <label>
                <span>Form</span>
                <select defaultValue="Tablet">
                  <option>Tablet</option>
                  <option>Topical</option>
                </select>
              </label>
              <label>
                <span>Strength</span>
                <input defaultValue="10 mg" />
              </label>
              <label>
                <span>Quantity</span>
                <input type="number" defaultValue="14" />
              </label>
              <label className="full">
                <span>Directions</span>
                <input defaultValue="Give 1 tablet by mouth twice daily" />
              </label>
              <label>
                <span>Refills</span>
                <input type="number" defaultValue="0" />
              </label>
              <label className="full">
                <span>Additional instructions</span>
                <textarea placeholder="Optional note to pharmacy/owner" />
              </label>
            </div>
            <div className="medication-tags">
              <button type="button" className="pill-button ghost small">
                Take with food
              </button>
              <button type="button" className="pill-button ghost small">
                May cause drowsiness
              </button>
              <button type="button" className="pill-button ghost small danger">
                Stop if vomiting
              </button>
            </div>
          </div>
        </section>

        <section className="add-items-card">
          <div className="section-header">
            <h3>Add items</h3>
            <button type="button" className="pill-button soft">
              + Add item
            </button>
          </div>
          <div className="item-row item-head">
            <span>Name</span>
            <span>Strength</span>
            <span>Form</span>
            <span>Directions</span>
            <span>Qty / Duration</span>
            <span>Actions</span>
          </div>
          <div className="item-list">
            {items.map((item) => (
              <div key={item.id} className="item-row">
                <div className="item-pill">
                  <strong>{item.name}</strong>
                </div>
                <div className="item-pill">{item.dosage}</div>
                <div className="item-pill">{item.form}</div>
                <div className="item-pill">{item.directions}</div>
                <div className="item-pill">{item.duration}</div>
                <button type="button" className="pill-button ghost small">
                  Edit
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="medical-record-grid">
          <div className="medical-record-card">
            <h3>Medical record</h3>
            <div className="record-details">
              <div>
                <span>Patient</span>
                <strong>{patient.name}</strong>
              </div>
              <div>
                <span>Active Dx</span>
                <strong>Allergic dermatitis</strong>
              </div>
              <div>
                <span>Allergies</span>
                <strong>{patient.allergies}</strong>
              </div>
              <div>
                <span>Weight</span>
                <strong>{patient.weight}</strong>
              </div>
            </div>

            <div className="record-history">
              <p>Recent visits</p>
              {recentVisits.map((visit) => (
                <div key={visit.title} className="history-row">
                  <FiClock aria-hidden="true" />
                  <div>
                    <strong>{visit.title}</strong>
                    <span>{visit.description}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="record-history">
              <p>Medication history</p>
              {medicationHistory.map((history) => (
                <div key={history.title} className="history-row">
                  <FiInfo aria-hidden="true" />
                  <div>
                    <strong>{history.title}</strong>
                    <span>Status: {history.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="pill-button ghost">
              Open full record
            </button>
          </div>

          <div className="guidance-card">
            <h3>Guidance</h3>
            <ul>
              <li>Include diagnosis and clear directions (Sig) for each item.</li>
              <li>Verify weight-based dosing where applicable.</li>
              <li>All prescriptions require admin verification before pickup.</li>
            </ul>
          </div>
        </section>

        <div className="prescription-actions">
          <button type="button" className="pill-button ghost">
            Save draft
          </button>
          <button type="button" className="pill-button">
            Submit for verification
          </button>
        </div>
      </main>
    </div>
  );
}

export default CreatePrescription;
