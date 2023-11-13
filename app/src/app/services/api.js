
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

  async getSession(data) {
    try {
      const response = await this.axiosInstance.post(endpoints.get_session,data);
      return response.data;
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  }
  async getUserSession(data) {
    try {
      const response = await this.axiosInstance.post(endpoints.get_user_session, data);
      return response.data;
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    }
  }
  async joinSession(data) {
    try {
      const response = await this.axiosInstance.post(endpoints.join_session,data);
      return response.data;
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    }
  }
  
async addQuestion(data) {
    try {
      const response = await this.axiosInstance.post(endpoints.add_question, data);
      return response.data;
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  }


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

