import axios from "axios";

class ActivDataService {

  getAll(page = 0) {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs?page=${page}`);
  }

  find(query, by="name", page=0) {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs?${by}=${query}&page=${page}`);
  }

  getTags() {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/tags`);
  }

  getActivDetail(activ_id) {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/id/${activ_id}`);
  }

  createReview(data) {
    return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/review`, data);
  }

  updateReview(data) {
    return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/review`, data);
  }

  deleteReview(data) {
    return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/review`, {data});
  }
  
  creatActiv(data) {
    return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/`, data);
  }
  
  updateActiv(data) {
    return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/`, data);
  }

  updateActivRating(data) {
    return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/review/rating`, data);
  }

  deleteActivs(data) {
    return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/delete`, data);  
  }

  getActivsByUser(userId){
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/userId/${userId}`);
  }
}

export default new ActivDataService();