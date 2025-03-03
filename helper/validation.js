const yup = require("yup");

// ====================================================
// =================== USERS =======================
// ====================================================


const ADD_USER_EMPLOYEE = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Invalid email"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required(),
  fullname: yup.string().required("ກະລຸນາຕື່ມ fullname"),
  username: yup.string().required("Invalid username"),
  phone: yup.string().required("ກະລຸນາຕື່ມ phone"),
  dob: yup.string().required("ກະລຸນາຕື່ມ dob"),
  phone: yup.string().required("ກະລຸນາຕື່ມ phone"),
});

const RESERT_PASSWORD = yup.object().shape({
  new_password: yup
    .string()
    .min(6, "ລະຫັດຜ່ານ ຕ້ອງມີ 6 ໂຕຂຶ່ນໄປ")
    .required(),
});

module.exports = {

  ADD_USER_EMPLOYEE,
  RESERT_PASSWORD

};
