import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material"
import { registerAPI } from "~/apis"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!")
      return
    }

    setLoading(true)
    try {
      await registerAPI({ email, password })
      setSuccess(true)
    } catch (err) {
      setError(
        err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.",
      )
    } finally {
      setLoading(false)
    }
  }

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
          width: "100%",
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}
          >
            Đăng ký tài khoản Trello
          </Typography>

          {success ? (
            <Box sx={{ textAlign: "center" }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Đăng ký thành công! Chúng tôi đã gửi một email xác thực đến{" "}
                <strong>{email}</strong>. Vui lòng kiểm tra hộp thư để kích hoạt
                tài khoản.
              </Alert>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Quay lại trang đăng nhập
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegister}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Email của bạn"
                type="email"
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                required
              />

              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                required
              />

              <TextField
                label="Xác nhận lại mật khẩu"
                type="password"
                fullWidth
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 3 }}
                required
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ py: 1.2, fontWeight: 700, mb: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Đăng Ký"
                )}
              </Button>

              <Typography variant="body2" sx={{ textAlign: "center" }}>
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "#1976d2",
                    fontWeight: 600,
                  }}
                >
                  Đăng nhập ngay
                </Link>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Register
