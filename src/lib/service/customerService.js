import axios from "../axiosCustomize";

// Cache để lưu trữ kết quả geocoding
const geocodeCache = new Map();

export const getCoordinatesFromAddress = async (address) => {
    // Kiểm tra cache trước
    if (geocodeCache.has(address)) {
        return geocodeCache.get(address);
    }

    try {
        const response = await axios.get(
            `https://rsapi.goong.io/geocode?address=${encodeURIComponent(address)}&api_key=${import.meta.env.VITE_GOONG_API}`
        );
        // Lưu kết quả vào cache
        geocodeCache.set(address, response.data);
        return response.data;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};

export const getAllBar = async (search = '', pageIndex = 1, pageSize = 10) => {
    return await axios.get(`api/v1/bars`, {
        params: {
            search,
            pageIndex,
            pageSize
        }
    });
};


export const getAllBarForMap = async (pageIndex = 1, pageSize = 10) => {
    try {
        const response = await axios.get(`api/v1/bar/customer/getBar`, {
            params: {
                pageIndex,
                pageSize
            }
        });
        if (response.data.statusCode === 200) {
            const barsWithCoordinates = await Promise.all(
                response.data.data.map(async (bar) => {
                    try {
                        const geoResponse = await getCoordinatesFromAddress(bar.address);
                        if (geoResponse?.results?.[0]?.geometry?.location) {
                            const location = geoResponse.results[0].geometry.location;
                            return {
                                ...bar,
                                latitude: location.lat,
                                longitude: location.lng
                            };
                        }
                    } catch (error) {
                        console.error("Error getting coordinates for bar:", error);
                    }
                    return bar;
                })
            );
            response.data.data = barsWithCoordinates.filter(bar => bar.latitude && bar.longitude);
        }
        
        return response;
    } catch (error) {
        console.error("Error fetching bars for map:", error);
        throw error;
    }
};

export const getAllBarAvailable = async (date) => {
    return await axios.get(`api/v1/bars/${date}`);
}

export const getBarById = async (barId) => {
    try {
        const response = await axios.get(`api/v1/bar-detail/${barId}`);
        
        if (response.data.statusCode === 200) {
            const barData = response.data.data;
            
            // Nếu chưa có tọa độ, lấy từ địa chỉ
            if (!barData.latitude || !barData.longitude) {
                const geoResponse = await getCoordinatesFromAddress(barData.address);
                if (geoResponse?.results?.[0]?.geometry?.location) {
                    const location = geoResponse.results[0].geometry.location;
                    barData.latitude = location.lat;
                    barData.longitude = location.lng;
                }
            }
            
            response.data.data = barData;
        }
        
        return response;
    } catch (error) {
        console.error("Error getting bar details:", error);
        throw error;
    }
};

export const getBarTableById = async (barId) => {

    return await axios.get(`api/v1/bar-table/${barId}`);
}

export const getBranchById =  (id) => {
    const branches = getBranchesData();
    return branches.find(branch => branch.id === id);
}
