import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '51217923-e424984f9b43f1bcfdccd2a18';

export async function getImagesByQuery(query, page) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 15,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
