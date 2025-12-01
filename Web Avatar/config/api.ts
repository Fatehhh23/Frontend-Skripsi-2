const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  ping: `${API_BASE_URL}/api/ping`,
  runSimulation: `${API_BASE_URL}/api/v1/simulation/run`,
  getSimulation: (id: string) => `${API_BASE_URL}/api/v1/simulation/${id}`,
  realtimeEarthquakes: `${API_BASE_URL}/api/v1/earthquakes/realtime`,
  getEarthquake: (id: string) => `${API_BASE_URL}/api/v1/earthquakes/${id}`,
};

export default API_BASE_URL;
