import axios from '../axiosCustomize';

class TableService {
  static async getTables(tableTypeId, status, pageIndex, pageSize) {
    let url = `api/Table/manage?PageIndex=${pageIndex}&PageSize=${pageSize}`;
    
    if (tableTypeId) {
      url += `&TableTypeId=${tableTypeId}`;
    }
    
    if (status !== null) {
      url += `&Status=${status}`;
    }

    const response = await axios.get(url);
    return response;
  }

  static async getTablesOfBar(barId, tableTypeId, status, pageIndex, pageSize) {
    let url = `api/Table/tables-of-bar?BarId=${barId}&PageIndex=${pageIndex}&PageSize=${pageSize}`;
    
    if (tableTypeId) {
      url += `&TableTypeId=${tableTypeId}`;
    }
    
    if (status !== null) {
      url += `&Status=${status}`;
    }

    const response = await axios.get(url);
    return response;
  }

  static async addTable(tableData) {
    const response = await axios.post('api/Table', tableData);
    return response;
  }

  static async updateTable(tableId, tableData) {
    const response = await axios.patch(`api/Table/${tableId}`, tableData);
    return response;
  }

  static async deleteTable(tableId) {
    const response = await axios.delete(`api/Table/${tableId}`);
    return response;
  }

  static async updateTableStatus(tableId, status) {
    const response = await axios.patch(`api/Table/status?TableId=${tableId}&Status=${status}`);
    return response;
  }
}

export default TableService;
