import axios from '../axiosCustomize'; // Import your customized axios instance

class TableService {
  static async getTables(BarId, TableTypeId, Status, PageIndex, PageSize) {
    // Xây dựng URL
    let url = `api/Table/staff?BarId=${BarId}&TableTypeId=${TableTypeId}&PageIndex=${PageIndex}&PageSize=${PageSize}`;
    
    // Chỉ thêm Status vào URL nếu nó không phải là null
    if (Status !== null) {
      url += `&Status=${Status}`;
    }

    const response = await axios.get(url);
    return response.data; // Trả về dữ liệu từ phản hồi
  }

  static async addTable(tableData) {
    return await axios.post('api/Table', tableData);
  }

  static async updateTable(tableId, tableData) {
    return await axios.patch(`api/Table/${tableId}`, tableData);
  }

  static async deleteTable(tableId) {
    return await axios.delete(`api/Table/${tableId}`);
  }
}

export default TableService;
