import axios from "axios";

const API_BASE_URL = 'https://localhost:7188/api/Patients';
const api = axios.create({
  baseURL: API_BASE_URL,
});
const getPatients = (searchTerm, pageIndex, pageSize) => {
    return axios.post(`${API_BASE_URL}/GetPatients`, {
        searchTerm,
        pageIndex,
        pageSize,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getPatientById = (patientID) => {
  return api.post(`/GetPatientById?Id=${patientID}`);
};

const createPatient = (patient) => {
  return api.post('/CreatePatient', patient);
};

const updatePatient = (patient) => {
  return api.post('/UpdatePatient', patient);
};

const deactivatePatient = (patient) => {
  return api.post('/DeactivatePatient', patient);
};

export { getPatients, getPatientById, createPatient, updatePatient, deactivatePatient };
