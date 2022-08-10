import axios from 'axios'
import { toast } from 'react-toastify'

let authorizedAxiosInstance = axios.create()
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10 // 10 minutes

// Kỹ thuật dùng javascript kết hợp css pointer-event để chặn user click nhanh tại bất kỳ chỗ nào có hành động click gọi api
// Đây là một kỹ thuật rất hay mà không phải dev nào cũng biết.
const updateSendingStatus = (sending = true) => {
  const submits = document.querySelectorAll('.tqd-send')
  for (let i = 0; i < submits.length; i++) {
    if (sending) submits[i].classList.add('tqd-waiting')
    else submits[i].classList.remove('tqd-waiting')
  }
}

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

authorizedAxiosInstance.interceptors.response.use((response) => {
  // Chuyển hướng URL từ phía BE nếu cần
  if (response?.status === 302) {
    location.replace(response?.headers?.location)
  }
  updateSendingStatus(false)

  return response
}, (error) => {
  updateSendingStatus(false)

  // Show message lỗi trả về từ Back-end API khi gọi bất kỳ một api nào
  let errorMessage = error?.message
  if (error?.response?.data?.errors) {
    errorMessage = error?.response?.data?.errors
  }
  toast.error(errorMessage)


  return Promise.reject(error)
})

export default authorizedAxiosInstance
