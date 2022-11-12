import axios from "axios";

class FavoriteDataService {

  getFavoritesById(userId) {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/favorites/${userId}`);
  }

  updateFavorites(data) {
    return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/favorites`, data);
  }
}

export default new FavoriteDataService();