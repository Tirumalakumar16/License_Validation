import axios from "axios";

export const loginUser = async (value) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`,value)
      
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }