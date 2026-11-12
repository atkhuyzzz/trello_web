import axios from "axios"
import { toast } from "react-toastify"
import { interceptorLoadingElements } from "~/utils/formatters"

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

//Cấu hình Interceptors
// Interceptor Request: can thiệp vào giữa hững request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    //Chặn spam click(file formatter chưa func)
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Interceptor Respone: can thiệp vào giữa hững respone nhận về
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    //Chặn spam click(file formatter chưa func)
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    //Mọi mã http status code nằm ngoài khoảng 200-299 sẽ là error và rơi vào đây
    //Chặn spam click(file formatter chưa func)
    interceptorLoadingElements(false)

    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }
    // Dùng toastify để hiển thị bất kỳ mọi mã lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token.
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  },
)

export default authorizedAxiosInstance
