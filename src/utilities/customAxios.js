import axios from 'axios'
import { toast } from 'react-toastify'
import { signOutUserAPI } from 'redux/user/userSlice'
import { refreshTokenAPI } from 'actions/ApiCall'

// How can I use the Redux store in non-component files?
// https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
// Inject store
let store
export const injectStore = _store => {
  store = _store
}

let authorizedAxiosInstance = axios.create()
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10 // 10 minutes
authorizedAxiosInstance.defaults.withCredentials = true // Make Axios send cookies in its requests automatically.

// Kỹ thuật dùng javascript kết hợp css pointer-event để chặn user click nhanh tại bất kỳ chỗ nào có hành động click gọi api
// Đây là một kỹ thuật rất hay mà không phải dev nào cũng biết.
const updateSendingStatus = (sending = true) => {
  const submits = document.querySelectorAll('.tqd-send')
  for (let i = 0; i < submits.length; i++) {
    if (sending) submits[i].classList.add('tqd-waiting')
    else submits[i].classList.remove('tqd-waiting')
  }
}

// Request
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Chỉ ok nếu status code nằm trong khoảng 200 > 209 (default của axios nếu bạn không làm gì),
  // Nhưng ở đây chúng ta cần viết lại validateStatus để chấp nhận mã 302 (mã cho phép chuyển hướng - redirect)
  config.validateStatus = (status) => {
    return (status >= 200 && status < 300) || status === 302
  }
  updateSendingStatus(true)

  return config
}, (error) => {
  return Promise.reject(error)
})


//Response
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Chuyển hướng URL từ phía BE nếu cần
  if (response?.status === 302) {
    location.replace(response?.headers?.location)
  }
  updateSendingStatus(false)

  return response
}, (error) => {
  updateSendingStatus(false)

  // Nhập mã 401 từ Backend trả về => gọi api signOut luôn
  if (error?.response?.status === 401) {
    store.dispatch(signOutUserAPI(false))
  }

  // Nếu nhận mã 410 từ Backend trả về thì xử lý refresh token
  const originalRequest = error.config
  if (error?.response?.status === 410 && !originalRequest._retry) {
    originalRequest._retry = true

    // Gọi refresh mà success thì token mới sẽ lại nằm trong cookie, còn nếu nhận bất kỳ lỗi nào từ api refresh token thì cứ logout luôn
    // Quan trọng: Phải return function ở đây vì nếu không làm thế thì lúc refresh token xong rồi nhưng data vẫn không được cập nhật mới nhất, có thể thử bỏ để test
    return refreshTokenAPI()
    // eslint-disable-next-line no-unused-vars
      .then((data) => {
        // Không cần dùng data.accessToken ở đây vì chúng ta đã set cookie cho accessToken từ phía server
        // Return lại instance của chúng ta kết hợp originalRequest để call lại api ban đầu
        return authorizedAxiosInstance(originalRequest)
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        store.dispatch(signOutUserAPI(false))
      })
  }
  // Show message lỗi trả về từ Back-end API khi gọi bất kỳ một api nào
  let errorMessage = error?.message
  if (error?.response?.data?.errors) {
    errorMessage = error?.response?.data?.errors
  }
  toast.error(errorMessage)

  return Promise.reject(error)
})

export default authorizedAxiosInstance
