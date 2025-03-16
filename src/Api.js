export const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`);
      
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('응답이 JSON 형식이 아닙니다.');
      }
      
      const data = await response.json();
      console.log(`${endpoint} 응답:`, data);
      return data; 
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error; 
    }
  };
  