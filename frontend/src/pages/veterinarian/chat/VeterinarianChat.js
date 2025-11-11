import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiSend } from "react-icons/fi";
import VetSidebar from "../../../components/VetSidebar";
import "../dashboard/VeterinarianDashboard.css";
import "./VeterinarianChat.css";

const conversations = [
  {
    id: "alex",
    name: "Alex Rivera • Luna",
    preview: "Thanks, see you at 2pm!",
    time: "09:12",
    unread: false,
  },
  {
    id: "priya",
    name: "Priya Patel • Max",
    preview: "Could you review his results?",
    time: "08:40",
    unread: false,
  },
  {
    id: "ops",
    name: "Ops Admin",
    preview: "Inventory sync complete.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "jamie",
    name: "Jamie Lee • Coco",
    preview: "Can we adjust meds?",
    time: "Unread",
    unread: true,
  },
];

const messageThread = [
  {
    from: "Alex",
    text: "Hi Dr. Gray! Luna finished her antibiotics yesterday.",
    time: "09:12",
  },
  {
    from: "vet",
    text: "Great to hear. Any remaining symptoms?",
    time: "09:13",
  },
  {
    from: "Alex",
    text: "Slight cough in the morning but eating fine.",
    time: "09:14",
  },
  {
    from: "vet",
    text: "Monitor for 48h. If cough persists, we'll adjust meds.",
    time: "09:15",
  },
];

const patientContext = {
  petName: "Luna",
  age: "2.5 yrs",
  breed: "Female • Border Collie",
  owner: "Alex Rivera",
  allergies: "None reported",
  latestVisit: "Sep 12, 2025 • URI follow-up",
  meds: "Amoxicillin 250mg BID x7d",
  records: [
    { label: "SOAP • URTI follow-up", date: "Sep 12" },
    { label: "Lab • CBC normal", date: "Sep 10" },
  ],
};

const quickActions = [
  { label: "Approve appointment" },
  { label: "Issue prescription" },
  { label: "Update status" },
];

function VeterinarianChat() {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState("alex");

  return (
    <div className="vet-chat-page vet-dashboard">
      <VetSidebar activeId="chat" />

      <main className="chat-main">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Vet workspace</p>
            <h1>Chat box</h1>
            <p>Message pet owners, admins, and staff. View patient context while you chat.</p>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="pill-button ghost"
              onClick={() => navigate("/vet-dashboard")}
            >
              Back to dashboard
            </button>
            <button type="button" className="pill-button soft">
              Prescription history
            </button>
          </div>
        </header>

        <section className="chat-grid">
          <div className="chat-column conversations">
            <div className="conversation-search">
              <FiSearch aria-hidden="true" />
              <input placeholder="Search name or pet" />
            </div>
            <div className="conversation-list">
              {conversations.map((conversation) => (
                <button
                  type="button"
                  key={conversation.id}
                  className={`conversation-item ${
                    selectedConversation === conversation.id ? "active" : ""
                  } ${conversation.unread ? "unread" : ""}`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div>
                    <strong>{conversation.name}</strong>
                    <p>{conversation.preview}</p>
                  </div>
                  <span>{conversation.time}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="chat-column thread">
            <div className="thread-header">
              <div>
                <strong>Alex Rivera</strong>
                <span>Owner of Luna • Today</span>
              </div>
              <div className="thread-actions">
                <button type="button" className="pill-button ghost small">
                  Schedule
                </button>
                <button type="button" className="pill-button ghost small">
                  New Rx
                </button>
              </div>
            </div>

            <div className="thread-body">
              {messageThread.map((message) => (
                <div
                  key={`${message.from}-${message.time}`}
                  className={`chat-bubble ${message.from === "vet" ? "self" : ""}`}
                >
                  <p>{message.text}</p>
                  <span>{message.time}</span>
                </div>
              ))}
            </div>

            <div className="thread-quick-reply">
              <button type="button" className="pill-button ghost small">
                Quick reply: Follow up in 2 days
              </button>
              <button type="button" className="pill-button ghost small">
                Share care tips
              </button>
            </div>

            <div className="thread-input">
              <input placeholder="Write a message..." />
              <div className="input-actions">
                <button type="button" className="pill-button ghost small">
                  Voice
                </button>
                <button type="button" className="pill-button">
                  <FiSend aria-hidden="true" />
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="chat-column patient-context">
            <div className="context-card">
              <div className="context-header">
                <div>
                  <strong>{patientContext.petName}</strong>
                  <span>{patientContext.age}</span>
                  <span>{patientContext.breed}</span>
                </div>
                <button type="button" className="pill-button ghost small">
                  View medical record
                </button>
              </div>

              <div className="context-details">
                <div>
                  <span>Owner</span>
                  <strong>{patientContext.owner}</strong>
                </div>
                <div>
                  <span>Allergies</span>
                  <strong>{patientContext.allergies}</strong>
                </div>
                <div>
                  <span>Latest visit</span>
                  <strong>{patientContext.latestVisit}</strong>
                </div>
                <div>
                  <span>Current meds</span>
                  <strong>{patientContext.meds}</strong>
                </div>
              </div>

              <div className="context-section">
                <p>Records</p>
                {patientContext.records.map((record) => (
                  <div key={record.label} className="record-row">
                    <span>{record.label}</span>
                    <span>{record.date}</span>
                  </div>
                ))}
              </div>

              <div className="context-section">
                <p>Quick actions</p>
                <div className="quick-actions">
                  {quickActions.map((action) => (
                    <button key={action.label} type="button" className="pill-button ghost small">
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default VeterinarianChat;
