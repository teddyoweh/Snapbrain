
import axios from 'axios';
import { endpoints } from '../config/endpoints';
import { ip } from '../config/ip';

 
class MicroService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  async createSession(data) {
    try {
      const response = await this.axiosInstance.post(endpoints.create_session, data);
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async joinSession(sessionId, data) {
    try {
      const response = await this.axiosInstance.post(`/join_session/${sessionId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    }
  }
t
  async getImages(data) {
    try {
      const response = await this.axiosInstance.get(endpoints.images);
      return response.data.images;
    } catch (error) {
      console.error('Error calling some endpoint:', error);
      throw error;
    }
  }
}

 
const MicroServiceClient = new MicroService(ip);

export default MicroServiceClient;

