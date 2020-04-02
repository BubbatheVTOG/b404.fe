import axios from 'axios';

export const getAllCompanies = () =>
  axios.get(window.__env__.API_URL + '/blink/api/company', {
    headers: {
      Authorization: localStorage.getItem('token')
    }
  });

export const getPerson = (uuid) => 
  axios.get(window.__env__.API_URL + (uuid ? `/blink/api/person/id/${uuid}` : '/blink/api/person/'), {
    headers: {
      Authorization: localStorage.getItem('token')
    }
  });

export const getMilestone = (uuid) => 
  axios.get(window.__env__.API_URL + `/blink/api/milestone/${uuid}`, {
    headers: {
      Authorization: localStorage.getItem('token')
    }
  });

export const getWorkflowTemplates = () => 
  axios.get(window.__env__.API_URL + `/blink/api/workflow/templates`, {
    headers: {
      Authorization: localStorage.getItem('token')
    }
  });

export const getVerbs = () =>
  axios.get(window.__env__.API_URL + '/blink/api/verb/', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': localStorage.getItem('token')
    }
  })
