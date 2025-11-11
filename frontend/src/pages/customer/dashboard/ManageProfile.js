import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './ManageProfile.css';

const speciesOptions = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'];

const initialPetForm = {
  name: '',
  species: 'Dog',
  age: '',
  notes: '',
};

const formatDateOnly = (value) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return value.split('T')[0] || value;
  }
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const personalFields = [
  { label: 'Full name', accessor: (profile) => profile?.fullName || '—' },
  { label: 'Role', accessor: (profile) => profile?.role || 'customer' },
  { label: 'Email', accessor: (profile) => profile?.email || '—' },
  { label: 'Phone', accessor: (profile) => profile?.phoneNumber || '—' },
  { label: 'Address', accessor: (profile) => profile?.address || '—' },
  { label: 'Date of birth', accessor: (profile) => formatDateOnly(profile?.dateOfBirth) },
];

function ManageProfile({
  title = 'Manage personal & pet profiles',
  description = 'Update your details and keep pet information accurate for faster bookings.',
  showPetManagement = true,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'pets' ? 'pets' : 'info';
  });
  const [profile, setProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petForm, setPetForm] = useState(initialPetForm);
  const [petFormVisible, setPetFormVisible] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [petSubmission, setPetSubmission] = useState({ loading: false, message: null });
  const [globalMessage, setGlobalMessage] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && (tab === 'info' || tab === 'pets')) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileResponse = await api.get('/auth/profile');
        setProfile(profileResponse.data);
        if (showPetManagement) {
          const petsResponse = await api.get('/pets');
          setPets(petsResponse.data || []);
        } else {
          setPets([]);
        }
      } catch (error) {
        const message =
          error.response?.data?.message || error.message || 'Unable to load profile data.';
        setGlobalMessage(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showPetManagement]);

  const handleOpenPetForm = (pet = null) => {
    if (pet) {
      setEditingPet(pet);
      setPetForm({
        name: pet.name || '',
        species: pet.species || 'Dog',
        age: pet.age === 0 || pet.age ? pet.age.toString() : '',
        notes: pet.notes || '',
      });
    } else {
      setEditingPet(null);
      setPetForm(initialPetForm);
    }
    setPetFormVisible(true);
    setPetSubmission({ loading: false, message: null });
  };

  const handleClosePetForm = () => {
    setPetFormVisible(false);
    setEditingPet(null);
    setPetForm(initialPetForm);
  };

  const handlePetInputChange = (event) => {
    const { name, value } = event.target;
    setPetForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPet = async (event) => {
    event.preventDefault();
    if (!petForm.name || !petForm.species || petForm.age === '') {
      setPetSubmission({ loading: false, message: 'Please fill the required fields.' });
      return;
    }

    const ageNumber = Number(petForm.age);
    if (Number.isNaN(ageNumber) || ageNumber < 0) {
      setPetSubmission({ loading: false, message: 'Age must be a positive number.' });
      return;
    }

    try {
      setPetSubmission({ loading: true, message: null });
      const payload = {
        name: petForm.name,
        species: petForm.species,
        age: ageNumber,
      };

      const response = editingPet
        ? await api.put(`/pets/${editingPet.petId}`, payload)
        : await api.post('/pets', payload);

      setPets((prev) =>
        editingPet
          ? prev.map((pet) => (pet.petId === editingPet.petId ? response.data : pet))
          : [...prev, response.data],
      );

      handleClosePetForm();
      setPetSubmission({ loading: false, message: null });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        `Unable to ${editingPet ? 'update' : 'create'} pet.`;
      setPetSubmission({ loading: false, message });
    }
  };

  const formatAge = (age) => {
    if (age === null || age === undefined || Number.isNaN(age)) {
      return 'Age unknown';
    }
    return `${age} yr${age === 1 ? '' : 's'}`;
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="profile-user">
          <div className="user-avatar">
            <i className="fa-solid fa-user-circle" />
          </div>
          <div>
            <div className="user-name">{user?.fullName || user?.email || 'Customer'}</div>
            <div className="user-role">{user?.role || 'customer'}</div>
          </div>
        </div>
        <div className="profile-actions">
          <button
            type="button"
            className={`btn secondary small ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <i className="fa-solid fa-id-badge" />
            Personal info
          </button>
          {showPetManagement && (
            <button
              type="button"
              className={`btn secondary small ${activeTab === 'pets' ? 'active' : ''}`}
              onClick={() => setActiveTab('pets')}
            >
              <i className="fa-solid fa-paw" />
              Pets
            </button>
          )}
          <button
            type="button"
            className="btn primary small"
            onClick={() =>
              navigate(showPetManagement ? '/dashboard/appointments' : '/vet-dashboard')
            }
          >
            <i className="fa-solid fa-calendar-check" />
            {showPetManagement ? 'Book service appointments' : 'Back to dashboard'}
          </button>
        </div>
      </header>

      {globalMessage && <div className="profile-message error">{globalMessage}</div>}

      {showPetManagement && (
        <div className="profile-tabs">
          <button
            type="button"
            className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <i className="fa-solid fa-circle-info" />
            Personal info
          </button>
          <button
            type="button"
            className={`profile-tab ${activeTab === 'pets' ? 'active' : ''}`}
            onClick={() => setActiveTab('pets')}
          >
            <i className="fa-solid fa-paw" />
            Pets
          </button>
        </div>
      )}

      {activeTab === 'info' ? (
        <section className="profile-card info-card">
          <div className="card-header">
            <h2>Personal information</h2>
          </div>
          <div className="card-body info-grid">
            {personalFields.map((field) => (
              <div key={field.label} className="info-field">
                <label>{field.label}</label>
                <div className="info-value">{field.accessor(profile)}</div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="profile-card pets-card">
          <div className="card-header">
            <h2>Your pets</h2>
            <button type="button" className="btn primary small" onClick={() => handleOpenPetForm()}>
              <i className="fa-solid fa-plus" />
              Add pet
            </button>
          </div>
          <div className="card-body pet-list">
            {pets.length === 0 ? (
              <div className="empty-state">
                <i className="fa-solid fa-paw" />
                <p>You haven&apos;t added any pets yet. Create one to speed up bookings.</p>
                <button type="button" className="btn primary" onClick={() => handleOpenPetForm()}>
                  Add your first pet
                </button>
              </div>
            ) : (
              pets.map((pet) => (
                <div key={pet.petId} className="pet-card">
                  <div className="pet-avatar">
                    <i className="fa-solid fa-paw" />
                  </div>
                  <div className="pet-info">
                    <div className="pet-name">{pet.name}</div>
                    <div className="pet-meta">
                      {pet.species} · {formatAge(pet.age)}
                    </div>
                  </div>
                  <div className="pet-actions">
                    <button type="button" className="btn-link" disabled>
                      Records
                    </button>
                    <button type="button" className="btn-link" onClick={() => handleOpenPetForm(pet)}>
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {petFormVisible && (
        <div className="pet-dialog-backdrop">
          <div className="pet-dialog">
            <div className="dialog-header">
              <h3>{editingPet ? 'Edit pet' : 'Add a pet'}</h3>
              <button type="button" className="btn-icon" onClick={handleClosePetForm}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form className="dialog-body" onSubmit={handleSubmitPet}>
              <label htmlFor="pet-name">Name</label>
              <input
                id="pet-name"
                name="name"
                type="text"
                value={petForm.name}
                onChange={handlePetInputChange}
                placeholder="E.g. Mochi"
                required
              />

              <label htmlFor="pet-species">Species</label>
              <select
                id="pet-species"
                name="species"
                value={petForm.species}
                onChange={handlePetInputChange}
              >
                {speciesOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label htmlFor="pet-age">Age (years)</label>
              <input
                id="pet-age"
                name="age"
                type="number"
                min="0"
                value={petForm.age}
                onChange={handlePetInputChange}
                placeholder="2"
                required
              />

              <label htmlFor="pet-notes">Notes (optional)</label>
              <textarea
                id="pet-notes"
                name="notes"
                value={petForm.notes}
                onChange={handlePetInputChange}
                placeholder="Allergies, favourite treats, behaviour notes..."
              />

              {petSubmission.message && (
                <div className="profile-message error">{petSubmission.message}</div>
              )}

              <div className="dialog-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={handleClosePetForm}
                  disabled={petSubmission.loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary" disabled={petSubmission.loading}>
                  {petSubmission.loading
                    ? 'Saving...'
                    : editingPet
                      ? 'Save changes'
                      : 'Add pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProfile;
