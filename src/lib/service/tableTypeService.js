import axios from '../axiosCustomize'; // Import your customized axios instance

class TableTypeService {
  static async getAllTableTypes() {
    try {
      return await axios.get('/api/TableType'); // Base URL is handled by axios instance
    } catch (error) {
      throw error;
    }
  }

  static async getAllTableTypesAdmin(params) {
    try {
      return await axios.get('/api/TableType/admin', { params }); // Include status in query params
    } catch (error) {
      throw error;
    }
  }

  static async deleteTableType(tableTypeId) {
    try {
      return await axios.delete(`/api/TableType/${tableTypeId}`);
    } catch (error) {
      throw error;
    }
  }

  static async addTableType(tableTypeData) {
    try {
      return await axios.post('/api/TableType', tableTypeData);
    } catch (error) {
      throw error;
    }
  }

  static async updateTableType(tableTypeId, tableTypeData) {
    try {
      return await axios.patch(`/api/TableType/${tableTypeId}`, tableTypeData);
    } catch (error) {
      throw error;
    }
  }
}

export default TableTypeService;
