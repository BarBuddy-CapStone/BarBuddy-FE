import axios from '../axiosCustomize';

class TableTypeService {
  static async getAllTableTypes() {
    return await axios.get('api/TableType');

  }

  static async getAllTableTypesAdmin(params) {
    return await axios.get('api/TableType/admin', { params });
  }

  static async deleteTableType(tableTypeId) {
    return await axios.delete(`api/TableType/${tableTypeId}`);
  }

  static async addTableType(tableTypeData) {
    return await axios.post('api/TableType', tableTypeData);
  }

  static async updateTableType(tableTypeId, tableTypeData) {
    return await axios.patch(`api/TableType/${tableTypeId}`, tableTypeData);
  }
}

export default TableTypeService;
