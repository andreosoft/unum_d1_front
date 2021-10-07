const api = {
  doctorSignUp: "/api/signup/registration/doctor",
  doctorLogin: "/api/signup/get_token",
  getUserProfile: "/api/signup/get_profile",
  getDoctorProfile: "/api/doctor/profile",
  postDoctorProfile: "/api/doctor/profile",
  confirmLogin: "/api/signup/login_exists",

  getPatients: "/api/doctor/patients",
  getSelectedPatient: "/api/doctor/patients", // :id
  createNewPatient: "/api/doctor/patients",
  updatePatient: "doctor/patients",
  requestAccess: "/api/doctor/patients/request-access",

  getDoctors: "/api/doctor/doctors",
  getSelectedDoctor: "/api/doctor/doctors", // :id

  postClinicalRecords: "/api/doctor/clinical_records",
  getClinicalRecords: "/api/doctor/clinical_records", // /doctor/clinical_records?filters={"patient_id":31}

  getLangItems: "/api/translations", // /translations/:lang/:item

  schedule: "/api/doctor/schedule", // get
  addDoctorSchedule: "/api/doctor/schedule", // post
  deleteScheduleItem: "/api/doctor/schedule", // delete doctor/schedule/:id

  postImage: "/api/image/upload",
  getImage: "http://api.neomedy.com/api/image/download", // '/image/download/:id', width & height queries

  postFile: "/api/file/upload",
  getFile: "/api/file/download", // '/file/download/:file',

  createNewChat: "messegner/new_private_chat", // { to_id: '123'}
  getUserChats: "messegner/chats",
  getUserMessages: "messegner/messages", // /:chat_id?pager={ count: 0, limit: 25, page: 0 }
  postMessage: "messegner/messages", // /:chat_id { message: "message", attachments: "{}" }
};
export default api;
