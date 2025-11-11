import React, { useState } from "react";
import VetSidebar from "../../../components/VetSidebar";
import { FiSearch, FiUploadCloud } from "react-icons/fi";
import "../dashboard/VeterinarianDashboard.css";
import "./UpdateMedicalRecords.css";

const patients = [
  {
    id: "mocha",
    name: "Mocha",
    owner: "Anna Lee",
    species: "Dog",
    age: "3y",
    avatar: "https://i.pravatar.cc/60?img=5",
    weight: "12.4 kg",
    allergies: "None",
    vet: "Dr. Gray",
    diagnosis: "Skin rash",
  },
  {
    id: "milo",
    name: "Milo",
    owner: "Daniel Park",
    species: "Cat",
    age: "2y",
    avatar: "https://i.pravatar.cc/60?img=12",
    weight: "8.1 kg",
    allergies: "Chicken protein",
    vet: "Dr. Patel",
    diagnosis: "Allergy management",
  },
];

const records = {
  mocha: [
    {
      date: "2025-05-11",
      summary: "Skin rash resolved; advised hypoallergenic shampoo.",
      vet: "Dr. Gray",
      files: 2,
    },
    {
      date: "2025-03-02",
      summary: "Annual vaccination completed.",
      vet: "Dr. Gray",
      files: 1,
    },
  ],
  milo: [
    {
      date: "2025-06-21",
      summary: "Follow-up after diet adjustment. Improved appetite.",
      vet: "Dr. Patel",
      files: 0,
    },
  ],
};

const attachments = {
  mocha: [{ name: "bloodwork-mocha.pdf", size: "324 KB" }],
  milo: [{ name: "allergy-panel-milo.pdf", size: "412 KB" }],
};

function UpdateMedicalRecords() {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);

  const patientRecords = records[selectedPatient.id] ?? [];
  const patientAttachments = attachments[selectedPatient.id] ?? [];

  return (
    <div className="vet-medical-page vet-dashboard">
      <VetSidebar activeId="medical" />

      <main className="vet-medical-main">
        <header className="medical-header">
          <div>
            <p className="eyebrow">Care workspace</p>
            <h1>Update Pet Medical Records</h1>
            <p>Search a pet, then view records, upload attachments, or update medical info.</p>
          </div>
          <button type="button" className="pill-button">
            Open recent
          </button>
        </header>

        <section className="medical-filters">
          <label className="chip-input">
            <span>Search pet or owner</span>
            <div>
              <FiSearch aria-hidden="true" />
              <input placeholder="Search patient workspace" />
            </div>
          </label>
          <label className="chip-input">
            <span>Species</span>
            <select>
              <option>All</option>
              <option>Dog</option>
              <option>Cat</option>
            </select>
          </label>
          <label className="chip-input">
            <span>Status</span>
            <select>
              <option>All</option>
              <option>In review</option>
              <option>Verified</option>
            </select>
          </label>
          <label className="chip-input">
            <span>Sort</span>
            <select>
              <option>Recent</option>
              <option>Oldest</option>
            </select>
          </label>
        </section>

        <section className="medical-grid">
          <div className="patient-workspace">
            <div className="workspace-header">
              <div>
                <p className="eyebrow">Patient</p>
                <h2>Workspace</h2>
              </div>
              <div className="workspace-actions">
                <button type="button" className="workspace-chip">
                  View Medical Record
                </button>
                <button type="button" className="workspace-chip">
                  Upload Attachments
                </button>
                <button type="button" className="workspace-chip">
                  Add / Update Medical Information
                </button>
              </div>
            </div>

            <div className="patient-table">
              <div className="patient-head">
                <span>Pet</span>
                <span>Owner</span>
                <span>Species</span>
                <span>Age</span>
                <span>Actions</span>
              </div>
              {patients.map((patient) => (
                <div key={patient.id} className="patient-row">
                  <div className="patient-info">
                    <img src={patient.avatar} alt={patient.name} />
                    <div>
                      <strong>{patient.name}</strong>
                    </div>
                  </div>
                  <div className="patient-owner">
                    <strong>{patient.owner.split(" ")[0]}</strong>
                    <span>{patient.owner.split(" ")[1]}</span>
                  </div>
                  <div className="patient-meta">{patient.species}</div>
                  <div className="patient-meta">{patient.age}</div>
                  <button
                    type="button"
                    className="pill-button ghost"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    Open record
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="patient-snapshot">
            <h3>Patient snapshot</h3>
            <div className="snapshot-grid">
              <span>Pet: {selectedPatient.name}</span>
              <span>Owner: {selectedPatient.owner}</span>
              <span>Weight: {selectedPatient.weight}</span>
              <span>Allergies: {selectedPatient.allergies}</span>
            </div>
            <p className="snapshot-note">Snapshot updates when you open a record.</p>

            <div className="shortcuts">
              <button type="button" className="shortcut-row">
                <span>View record</span>
                <span className="chip">Open</span>
              </button>
              <button type="button" className="shortcut-row">
                <span>Upload attachment</span>
                <span className="chip">Upload</span>
              </button>
              <button type="button" className="shortcut-row">
                <span>Add / Update info</span>
                <span className="chip">Start</span>
              </button>
            </div>
          </div>
        </section>

        <section className="medical-boards">
          <div className="medical-board">
            <div className="section-header">
              <h3>View Medical Record — {selectedPatient.name}</h3>
            </div>
            <div className="record-table">
              <div className="record-row record-head">
                <span>Date</span>
                <span>Summary</span>
                <span>Vet</span>
                <span>Files</span>
              </div>
              {patientRecords.map((entry) => (
                <div key={entry.date} className="record-row">
                  <span>{entry.date}</span>
                  <span>{entry.summary}</span>
                  <span>{entry.vet}</span>
                  <button type="button" className="pill-button ghost small">
                    {entry.files} file{entry.files === 1 ? "" : "s"}
                  </button>
                </div>
              ))}
            </div>
            <p className="record-note">
              Read-only view of previous entries. Use the editor below to add or update information.
            </p>
          </div>

          <div className="medical-board">
            <div className="section-header">
              <h3>Upload Attachments</h3>
            </div>
            <div className="attachment-table">
              <div className="attachment-head">
                <span>File name</span>
                <span>Size</span>
                <span>Actions</span>
              </div>
              {patientAttachments.map((file) => (
                <div key={file.name} className="attachment-row">
                  <strong>{file.name}</strong>
                  <span>{file.size}</span>
                  <button type="button" className="pill-button ghost danger small">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="attachment-actions">
              <button type="button" className="pill-button ghost">
                <FiUploadCloud aria-hidden="true" />
                Add file
              </button>
              <button type="button" className="pill-button">
                Upload all
              </button>
            </div>
            <p className="attachment-note">Supported: PDF, JPG, PNG. Max 10MB each.</p>
          </div>
        </section>

        <section className="medical-boards">
          <div className="medical-board">
            <div className="section-header">
              <h3>Add / Update Medical Information</h3>
            </div>
            <div className="medical-form-grid">
              <div className="pill-field">
                <span>Visit date</span>
                <input type="date" defaultValue="2025-06-30" />
              </div>
              <div className="pill-field">
                <span>Seen by</span>
                <input defaultValue={selectedPatient.vet} />
              </div>
              <div className="pill-field">
                <span>Reason for visit</span>
                <input placeholder="e.g. Annual wellness check" />
              </div>
              <div className="pill-field">
                <span>Vitals / Temp / HR / RR</span>
                <input placeholder="Add vitals" />
              </div>
              <div className="pill-field full">
                <span>Clinical notes</span>
                <textarea placeholder="Add detailed notes..." rows={3} />
              </div>
              <div className="pill-field">
                <span>Diagnosis</span>
                <input placeholder="Describe diagnosis" />
              </div>
              <div className="pill-field">
                <span>Plan</span>
                <input placeholder="Describe treatment plan" />
              </div>
              <div className="pill-field">
                <span>Medications prescribed</span>
                <input placeholder="Add medications" />
              </div>
              <div className="pill-field">
                <span>Follow-up date</span>
                <input type="date" />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="pill-button ghost">
                Save draft
              </button>
              <button type="button" className="pill-button">
                Submit for verification
              </button>
            </div>
            <p className="form-note">
              Submitting sends this entry for admin review before it becomes part of the official record.
            </p>
          </div>

          <div className="medical-board">
            <div className="section-header">
              <h3>Verification status</h3>
            </div>
            <div className="verification-list">
              <div className="verification-row">
                <strong>Current entry</strong>
                <span>Draft • awaiting submission</span>
                <button type="button" className="pill-button ghost small">
                  Draft
                </button>
              </div>
              <div className="verification-row">
                <strong>Last submission</strong>
                <span>2025-05-11 • Approved by Dr. Gray</span>
                <button type="button" className="pill-button ghost small">
                  View
                </button>
              </div>
            </div>
            <div className="verification-actions">
              <button type="button" className="pill-button ghost">
                Save draft
              </button>
              <button type="button" className="pill-button">
                Submit for verification
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UpdateMedicalRecords;
