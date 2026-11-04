import { useState, useEffect, useRef } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material"
import { verifyAccountAPI } from "~/apis"

function VerifyAccount() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")
  const navigate = useNavigate()

  // Chỉ một trạng thái duy nhất: loading | success | error
  // nên không bao giờ hiện khung đỏ và khung xanh cùng lúc.
  // Thiếu email hoặc token thì báo lỗi ngay từ đầu, không cần setState trong effect.
  const [status, setStatus] = useState(email && token ? "loading" : "error")
  const [message, setMessage] = useState(
    email && token ? "" : "Đường dẫn xác thực không hợp lệ.",
  )

  // Ở chế độ dev, React StrictMode chạy effect 2 lần. Nếu gọi API 2 lần thì lần 2 báo
  // "đã kích hoạt trước đó rồi" và đè lên kết quả thành công. Ref này đảm bảo chỉ gọi 1 lần.
  const calledRef = useRef(false)

  useEffect(() => {
    if (!email || !token || calledRef.current) return
    calledRef.current = true

    verifyAccountAPI({ email, token })
      .then(() => {
        setStatus("success")
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Xác thực thất bại.")
        setStatus("error")
      })
  }, [email, token])

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#f4f5f7",
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          p: 3,
          textAlign: "center",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Xác thực tài khoản Email
          </Typography>

          {status === "loading" && (
            <Box sx={{ py: 3 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>
                Đang tiến hành kích hoạt tài khoản cho bạn...
              </Typography>
            </Box>
          )}

          {status === "error" && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          {status === "success" && (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                Kích hoạt tài khoản thành công! Bây giờ bạn có thể đăng nhập vào
                hệ thống.
              </Alert>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Đăng nhập ngay
              </Button>
            </>
          )}

          {status !== "success" && (
            <Typography variant="body2" sx={{ mt: 3 }}>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                Quay lại trang đăng nhập
              </Link>
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default VerifyAccount
