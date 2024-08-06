import React, { useState, useEffect } from 'react';
import axios from "axios";
import { getPatients, deactivatePatient } from '../services/patientService';
import PatientFormUpdate from './PatientFormUpdate';
import PatientForm from './PatientForm';
import ConfirmModal from './ConfirmModal'; 


import '../css/PatientList.css';
import Modal from './Modal'; 

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [hoveredPatientID, setHoveredPatientID] = useState(null);
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [deactivationReason, setDeactivationReason] = useState('');


  const handleUpdateClick = (patientID) => {
    setSelectedPatientID(patientID);
    setShowUpdateForm(true);
  };

  const handleCreateClick = () => {
    setShowCreateForm(true);
  };

  useEffect(() => {
    fetchPatients();
  }, [currentPage]);

  const fetchPatients = async (term = '') => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getPatients(term, currentPage, pageSize);
      setPatients(response.data.patients);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      setError('Error fetching patients. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      setCurrentPage(1);
      fetchPatients(searchTerm);
    } else {
      setSearchTerm(event.target.value);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleDeactivateClick = (patientId) => {
    setSelectedPatientId(patientId);
    setModalOpen(true);
  };

  const handleConfirmDeactivate = async () => {
    try {
      const patient = {
        patientId: selectedPatientId,
        inactiveReason: deactivationReason,
      };
      await deactivatePatient(patient);
      alert('Patient deactivated successfully!');
      setModalOpen(false);
      setDeactivationReason('');
      window.location.reload();
    } catch (error) {
      console.error('Error deactivating patient:', error);
    }
  
  };

  const handleCancelDeactivate = () => {
    setModalOpen(false);
    setSelectedPatientId(null);
    setDeactivationReason('');

  };
  return (
    <div className="patient-list-container">
      <h1>Patient Management</h1>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleSearch}
          className="search-input"
        />
      </div>
      <button onClick={handleCreateClick} className="create-button">
        <i className="bi bi-plus-circle"></i> Create New Patient
      </button>
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <p><strong>Total Records:</strong> {totalRecords}</p>
          <ul className="patient-list">
            {patients.map((patient) => (
              <li key={patient.patientId}
                className="patient-card"
                onMouseEnter={() => setHoveredPatientID(patient.patientId)}
                onMouseLeave={() => setHoveredPatientID(null)}   
                >
                <div className="patient-info">
                  <div className="patient-header">
                    <h2>{`${patient.firstName} ${patient.lastName}`}</h2>
                    {hoveredPatientID === patient.patientId && (
                      <div className="patient-buttons">
                        <button onClick={() => handleUpdateClick(patient.patientId)}>
                          <i className="bi bi-pencil-square"></i>
                          <span className="button-text">Update</span>
                        </button>

                        <button onClick={() => handleDeactivateClick(patient.patientId)}>
                        <i class="bi bi-trash"></i>
                          <span className="button-text">Deactivate</span>

                          </button>

                      </div>
                    )}
                  </div>
                  <p><strong>Gender:</strong> {patient.gender}</p>
                  <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString('en-CA')}</p>
                  <p><strong>Active:</strong> {patient.isActive ? 'Yes' : 'No'}</p>
                  <div className="contact-info">
                    <h3>Contact Info</h3> 
                    {patient.contactInfos.map((contact) => (
                      <p key={contact.contactInfoID}><strong>{contact.contactType}:</strong> {contact.contactDetail}</p>
                    ))}
                  </div>
                  <div className="addresses">
                    <h3>Addresses</h3>
                    {patient.addresses.map((address) => (
                      <p key={address.addressID}>
                        <strong>{address.addressType}:</strong> {`${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`}
                      </p>
                    ))}
                  </div>
                  {showUpdateForm && selectedPatientID && (
                    <Modal onClose={() => setShowUpdateForm(false)}>
                      <PatientFormUpdate patientID={selectedPatientID} onClose={() => setShowUpdateForm(false)} />
                    </Modal>
                  )}
                  {showCreateForm && (
                    <Modal onClose={() => setShowCreateForm(false)}>
                      <PatientForm onClose={() => setShowCreateForm(false)} />
                    </Modal>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <ConfirmModal
            isOpen={modalOpen}
            message="Are you sure you want to deactivate this patient?"
            reason={deactivationReason}
            onReasonChange={setDeactivationReason}
            onConfirm={handleConfirmDeactivate}
            onCancel={handleCancelDeactivate}
          />
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-button"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`page-button ${index + 1 === currentPage ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientList;
