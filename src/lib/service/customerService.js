import axios from "../axiosCustomize";

export const getAllBar = async () => {
    return await axios.get(`api/v1/bars`);
}

export const getBarById = async (barId) => {
    return await axios.get(`api/v1/bar-detail/${barId}`);
}

export const getBarTableById = async (barId) => {

    return await axios.get(`api/v1/bar-table/${barId}`);
}

export const getBranchById =  (id) => {
    const branches = getBranchesData();
    return branches.find(branch => branch.id === id);
}

export const getDrinkData = () => {
    return [
        {
            id: 5,
            imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/bd5af23e81c55c7bed78816cce004eb0f92a76d0702c4975935175f80c1860a1?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "AUCHENTOSHAN 0,7ML",
            price: "3.380.000 VND"
        },
        {
            id: 1,
            imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/f2566eaaecffa2da01a3848c4edecf9c8638c639b631bccfec3e27e5e8c24bc1?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "AUCHENTOSHAN 0,7ML",
            price: "3.380.000 VND"
        },
        {
            id: 2,
            imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/eb59838a3f37d6a2e5cb9231eea3f4e6d7a658ee4704ada83b3f97518efa846c?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "AUCHENTOSHAN 0,7ML",
            price: "3.380.000 VND"
        },
        {
            id: 3,
            imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/8af940877dde28cb1388a0989d2c31f6d444b888716b51b4abbb3dc9802eefb9?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "AUCHENTOSHAN 0,7ML",
            price: "3.380.000 VND"
        },
        {
            id: 4,
            imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/659687eca4f798da773baab64fe0376d2fa0f9b5f66eda212758c012657a8e0d?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "AUCHENTOSHAN 0,7ML",
            price: "3.380.000 VND"
        }
    ];
}