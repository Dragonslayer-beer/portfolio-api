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
  new_password: yup.string().min(6, "ລະຫັດຜ່ານ ຕ້ອງມີ 6 ໂຕຂຶ່ນໄປ").required(),
});

// ====================================================
// =================== INSERT_SKILL =======================
// ====================================================

const INSERT_SKILL = yup.object().shape({
  skills_name: yup.string().required("ກະລຸນາຕື່ມ skills_name"),
  skills_icons: yup.string().required("ກະລຸນາຕື່ມ skills_icons"),
  // skills_link: yup.string().required("ກະລຸນາຕື່ມ skills_link"),
});

const UPDATE_SKILL = yup.object().shape({
  id: yup.string().required("ກະລຸນາຕື່ມ id"),
  skills_name: yup.string().required("ກະລຸນາຕື່ມ skills_name"),
  skills_icons: yup.string().required("ກະລຸນາຕື່ມ skills_icons"),
  // skills_link: yup.string().required("ກະລຸນາຕື່ມ skills_link"),
});

// ====================================================
// =================== Project =======================
// ====================================================

const INSERT_PROJECT = yup.object().shape({
  // projects_id: yup.string().required("ກະລຸນາຕື່ມ projects_id"),
  projects_name: yup.string().required("ກະລຸນາຕື່ມ projects_name"),
  projects_dec: yup.string().required("ກະລຸນາຕື່ມ projects_dec"),
  projects_img: yup.string().required("ກະລຸນາຕື່ມ projects_img"),
  user_id: yup.string().required("ກະລຸນາຕື່ມ user_id"),
  // projects_link: yup.string().required("ກະລຸນາຕື່ມ projects_link"),
  skill: yup
    .array()
    .of(
      yup.object().shape({
        skills_id: yup.string().required("ກະລຸນາຕື່ມ skills_id"),
      })
    )
    .required("ກະລຸນາຕື່ມ skills"),
});

const UPDATE_PROJECT_SKILL = yup.object().shape({
 projects_id: yup.string().required("ກະລຸນາຕື່ມ projects_id"),
 projects_name: yup.string().required("ກະລຸນາຕື່ມ projects_name"),
 projects_dec: yup.string().required("ກະລຸນາຕື່ມ projects_dec"),
 projects_img: yup.string().required("ກະລຸນາຕື່ມ projects_img"),
 user_id: yup.string().required("ກະລຸນາຕື່ມ user_id"),
//  projects_link: yup.string().required("ກະລຸນາຕື່ມ projects_link"),
 skill: yup
   .array()
   .of(
     yup.object().shape({
       skills_id: yup.string().required("ກະລຸນາຕື່ມ skills_id"),
     })
   )
   .required("ກະລຸນາຕື່ມ skills"),
});



// ====================================================
// =================== Certification =======================
// ====================================================

const INSERT_CERTIFICATION = yup.object().shape({
  // certification_id: yup.string().required("ກະລຸນາຕື່ມ certification_id"),
  certification_name: yup.string().required("ກະລຸນາຕື່ມ certification_name"),
  certification_dec: yup.string().required("ກະລຸນາຕື່ມ certification_dec"),
  date: yup.string().required("ກະລຸນາຕື່ມ date"),
  certification_img: yup.string().required("ກະລຸນາຕື່ມ certification_img"),
  // certification_link: yup.string().required("ກະລຸນາຕື່ມ projects_link"),
  user_id: yup.string().required("ກະລຸນາຕື່ມ user_id"),
});

const UPDATE_CERTIFICATION = yup.object().shape({
  certification_id: yup.string().required("ກະລຸນາຕື່ມ certification_id"),
  certification_name: yup.string().required("ກະລຸນາຕື່ມ certification_name"),
  certification_dec: yup.string().required("ກະລຸນາຕື່ມ certification_dec"),
  date: yup.string().required("ກະລຸນາຕື່ມ date"),
  certification_img: yup.string().required("ກະລຸນາຕື່ມ certification_img"),
  // certification_link: yup.string().required("ກະລຸນາຕື່ມ projects_link"),
  user_id: yup.string().required("ກະລຸນາຕື່ມ user_id"),
});

module.exports = {
  ADD_USER_EMPLOYEE,
  RESERT_PASSWORD,
  INSERT_SKILL,
  UPDATE_SKILL,
  INSERT_PROJECT,
  UPDATE_PROJECT_SKILL,
  INSERT_CERTIFICATION,
  UPDATE_CERTIFICATION
};
