import axios from "../axiosCustomize";

export const getBranchesData = () => {
    return [
        {
            id: 1,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/a0d4292c13b0cc51b2487f4c276cd7c0d96510872c4a855db190ff2db8e692d2?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "BarBuddy 1",
            rating: 4.8,
            reviews: 1222,
            address: "87A Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1",
            openingHours: "10:30 PM - 02:00 AM"
        },
        {
            id: 2,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/7cbd7d84e2ff7b5156aa5241bd27de56fe00bcb6e309e2c77ff2c39bf3b0b236?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "BarBuddy 2",
            rating: 5,
            reviews: 2000,
            address: "87A Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1",
            openingHours: "10:30 PM - 02:00 AM"
        },
        {
            id: 3,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/2f3601dbe8c6d0a812bccaf7ecf02686ec5b99038e314c058a00a37c16840608?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "BarBuddy 3",
            rating: 3,
            reviews: 2222,
            address: "87A Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1",
            openingHours: "10:30 PM - 02:00 AM"
        },
        {
            id: 4,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/677e2c38ccd2ea07e8a72aa6262c873572a4cfd3da719a1e25c2152169bb47c6?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "BarBuddy 4",
            rating: 4.8,
            reviews: 1222,
            address: "87A Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1",
            openingHours: "10:30 PM - 02:00 AM"
        },
        {
            id: 5,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/fc1f4652930fe4a25d46a46d1933e950912b6ceace8e777840ceccd123995783?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "BarBuddy 5",
            rating: 4.8,
            reviews: 1222,
            address: "87A Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1",
            openingHours: "10:30 PM - 02:00 AM"
        },
        {
            id: 6,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/4f4bc5cae670ae75847bb24a78027e45ce8487386c0a1043f999381ae9fa4831?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b",
            name: "BarBuddy 6",
            rating: 4.8,
            reviews: 1222,
            address: "87A Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1",
            openingHours: "10:30 PM - 02:00 AM"
        }
    ];
}

export const getAllBar = async () => {
    return await axios.get(`api/v1/bars`);
}

export const getBarById = async (id) => {
    return await axios.get(`api/v1/bar-detail?barId=${id}`);
}

export const getBranchById = (id) => {
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