const api = {
  doctorSignUp: "/signup/registration/doctor",
  doctorLogin: "/signup/get_token",
  getUserProfile: "/signup/get_profile",
  getDoctorProfile: "/doctor/profile",
  postDoctorProfile: "/doctor/profile",
  confirmLogin: "/signup/login_exists",

  getPatients: "/doctor/patients",
  getSelectedPatient: "/doctor/patients", // :id
  createNewPatient: "/doctor/patients",
  updatePatient: "doctor/patients",
  requestAccess: "/doctor/patients/request-access",

  getDoctors: "/doctor/doctors",
  getSelectedDoctor: "/doctor/doctors", // :id

  postClinicalRecords: "/doctor/clinical_records",
  getClinicalRecords: "/doctor/clinical_records", // /doctor/clinical_records?filters={"patient_id":31}

  getLangItems: "/translations", // /translations/:lang/:item

  schedule: "/doctor/schedule", // get
  addDoctorSchedule: "/doctor/schedule", // post
  deleteScheduleItem: "/doctor/schedule", // delete doctor/schedule/:id

  postImage: "/image/upload",
  getImage: "http://api.neomedy.com/api/image/download", // '/image/download/:id', width & height queries

  postFile: "file/upload",
  getFile: "/api/file/download", // '/file/download/:file',

  createNewChat: "messegner/new_private_chat", // { to_id: '123'}
  getUserChats: "messegner/chats",
  getUserMessages: "messegner/messages", // /:chat_id?pager={ count: 0, limit: 25, page: 0 }
  postMessage: "messegner/messages", // /:chat_id { message: "message", attachments: "{}" }

  addUserToChat: "messegner/add_user_to_chat", // { "chat_id": 13, to_id: 123 }
  newConsiliumChat: "messegner/new_group_chat", // { type: "3", name: "Новый консилиум чат", info: "{}" }
  newGroupChat: "messegner/new_group_chat", // { type: "2", name: "Новый групповой чат", info: "{}"}

  deleteChat: "messegner/chat", // DEELETE /:id
  clearChatHistory: "messegner/clear_chat_history", // /:id

  getDoctorSpecialty: "doctor/speciality/name",
};
export default api;
