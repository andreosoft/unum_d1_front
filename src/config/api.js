const api = {
  doctorSignUp: '/signup/registration/doctor',
  doctorLogin: '/signup/get_token',
  getUserProfile: '/signup/get_profile',
  getDoctorProfile: '/doctor/profile',
  postDoctorProfile: '/doctor/profile',
  confirmLogin: '/signup/login_exists',

  getPatients: '/doctor/patients',
  getSelectedPatient: '/doctor/patients', // :id
  createNewPatient: '/doctor/patients',
  updatePatient: 'doctor/patients',
  getDoctors: '/doctor/doctors',
  getSelectedDoctor: '/doctor/doctors', // :id

  postClinicalRecords: '/doctor/clinical_records',
  getClinicalRecords: '/doctor/clinical_records', // /doctor/clinical_records?filters={"patient_id":31}

  getLangItems: '/translations', // /translations/:lang/:item
  
  schedule: '/doctor/schedule', // get
  addDoctorSchedule: 'doctor/schedule', // post
  deleteScheduleItem: 'doctor/schedule', // delete doctor/schedule/:id

  postImage: '/image/upload',
  getImage: 'http://api.neomedy.com/api/image/download', // '/image/download/:name', width & height queries

  postFile: '/file/upload',
  getFile: '/file/download', // '/file/download/:file'

}
export default api