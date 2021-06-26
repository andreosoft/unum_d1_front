import axios from 'axios'

const localStorage = JSON.parse(window.localStorage.getItem('neomedy')) || ''

axios.defaults.baseURL = 'http://api.neomedy.com/api'
axios.defaults.headers.common['Authorization'] = localStorage.token

export default axios