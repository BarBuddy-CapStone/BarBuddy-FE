const useValidateAccountForm = () => {
    const validateForm = (formData) => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^0[3-9]\d{8,9}$/;
        const today = new Date();
        const dob = new Date(formData.dob || formData.birthDate); // Sử dụng dob hoặc birthDate
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (!formData.fullname || formData.fullname.length > 100) {
            errors.fullname = "Tên đầy đủ không được để trống và không vượt quá 100 ký tự";
        }
        if (!emailRegex.test(formData.email)) {
            errors.email = "Email không hợp lệ";
        }
        if (!phoneRegex.test(formData.phone)) {
            errors.phone = "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ.";
        }
        if (!formData.dob && !formData.birthDate || (age < 18 || (age === 18 && monthDiff < 0))) {
            errors.dob = "Bạn phải đủ 18 tuổi.";
        }

        return errors;
    };

    return { validateForm };
};

export default useValidateAccountForm;
