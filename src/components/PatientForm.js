import React, { useState, useEffect } from 'react';
import { createPatient } from '../services/patientService';
import '../css/PatientForm.css';

const PatientForm = () => {
  const [patient, setPatient] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    
    contactInfos: [{ contactType: '', contactDetail: '' }],
    primaryAddress: { street: '', city: '', state: '', zipCode: '', country: '' },
    secondaryAddress: { street: '', city: '', state: '', zipCode: '', country: '' }

  });
  const [patients, setPatients] = useState([]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const newContacts = [...patient.contactInfos];
    newContacts[index][name] = value;
    setPatient({ ...patient, contactInfos: newContacts });
  };
  const handlePrimaryAddressChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, primaryAddress: { ...patient.primaryAddress, [name]: value } });
  };

  const handleSecondaryAddressChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, secondaryAddress: { ...patient.secondaryAddress, [name]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedContacts = patient.contactInfos.flatMap(contact => {
      if (contact.contactType === 'Multiple') {
        return [
          { contactType: 'Phone', contactDetail: contact.contactDetail },
          { contactType: 'Email', contactDetail: contact.secondContactDetail }
        ];
      }
      return [contact];
    });
    const formattedAddresses = [
      { ...patient.primaryAddress, addressType: 'Primary' },
      patient.secondaryAddress.street && patient.secondaryAddress.city && patient.secondaryAddress.state && patient.secondaryAddress.zipCode && patient.secondaryAddress.country
        ? { ...patient.secondaryAddress, addressType: 'Secondary' }
        : null
    ].filter(address => address !== null);

    const formattedPatient = { 
      ...patient, 
      contactInfos: formattedContacts, 
      addresses: formattedAddresses,
      primaryAddress: undefined,
      secondaryAddress: undefined
    };

    try {
      await createPatient(formattedPatient);
      alert('Patient created successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  return (
    <div className="patient-form-container">
      <h1>Create Patient</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="firstName" value={patient.firstName} onChange={handleInputChange} required />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={patient.lastName} onChange={handleInputChange} required />
        </label>
        <label>
          Gender:
          <select name="gender" value={patient.gender} onChange={handleInputChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          Date of Birth:
          <input type="date" name="dateOfBirth" value={patient.dateOfBirth} onChange={handleInputChange} required />
        </label>

        <div className="contacts-form">
          <h3>Contact Infos</h3>
          <p className="contact-description">Contact info such as phone number or email address. There can be multiple of them.</p>
          {patient.contactInfos.map((contact, index) => (
            <div key={index} className="contact-info-form">
              <label>
                Contact Type:
                <select name="contactType" value={contact.contactType} onChange={(e) => handleContactChange(index, e)} required>
                  <option value="">Select Type</option>
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </label>
              <label>
                Contact Detail:
                <input type="text" name="contactDetail" value={contact.contactDetail} onChange={(e) => handleContactChange(index, e)} required />
              </label>
              {contact.contactType === 'Multiple' && (
                <label>
                  Second Contact Detail (Mail):
                  <input type="text" name="secondContactDetail" value={contact.secondContactDetail} onChange={(e) => handleContactChange(index, e)} required />
                </label>
              )}
            </div>
          ))}
        </div>

        <div className="addresses-form">
          <h3>Primary Address</h3>
          <div className="address-form">
            <label>
              Street:
              <input type="text" name="street" value={patient.primaryAddress.street} onChange={handlePrimaryAddressChange} required />
            </label>
            <label>
              City:
              <input type="text" name="city" value={patient.primaryAddress.city} onChange={handlePrimaryAddressChange} required />
            </label>
            <label>
              State:
              <input type="text" name="state" value={patient.primaryAddress.state} onChange={handlePrimaryAddressChange} required />
            </label>
            <label>
              Zip Code:
              <input type="text" name="zipCode" value={patient.primaryAddress.zipCode} onChange={handlePrimaryAddressChange} required />
            </label>
            <label>
              Country:
              <input type="text" name="country" value={patient.primaryAddress.country} onChange={handlePrimaryAddressChange} required />
            </label>
          </div>
        </div>

        <div className="addresses-form">
          <h3>Secondary Address (Optional)</h3>
          <div className="address-form">
            <label>
              Street:
              <input type="text" name="street" value={patient.secondaryAddress.street} onChange={handleSecondaryAddressChange} />
            </label>
            <label>
              City:
              <input type="text" name="city" value={patient.secondaryAddress.city} onChange={handleSecondaryAddressChange} />
            </label>
            <label>
              State:
              <input type="text" name="state" value={patient.secondaryAddress.state} onChange={handleSecondaryAddressChange} />
            </label>
            <label>
              Zip Code:
              <input type="text" name="zipCode" value={patient.secondaryAddress.zipCode} onChange={handleSecondaryAddressChange} />
            </label>
            <label>
              Country:
              <input type="text" name="country" value={patient.secondaryAddress.country} onChange={handleSecondaryAddressChange} />
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button">Create Patient</button>
      </form>
    </div>
  );
};

export default PatientForm;




