import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  Link,
} from "@mui/material"
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { loginUserAPI } from "~/apis"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setLoading(true)

    try {
      const res = await loginUserAPI({ email, password })
      // Lưu token và thông tin user vào localStorage
      localStorage.setItem("accessToken", res.accessToken)
      localStorage.setItem("userInfo", JSON.stringify(res.user))

      // Điều hướng vào trang Board làm việc
      navigate("/boards")
    } catch (error) {
      const msg =
        error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại!"
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#121212" : "#f4f5f7",
        p: 2,
      }}
    >
      <Card
        sx={{ maxWidth: 420, width: "100%", boxShadow: 4, borderRadius: 2 }}
      >
        <CardContent
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 48, height: 48 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            Đăng nhập hệ thống
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Quản lý công việc và dự án Kanban
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Địa chỉ Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600 }}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Link href="#" variant="body2" underline="hover">
                Quên mật khẩu?
              </Link>
              <Link href="/register" variant="body2" underline="hover">
                Chưa có tài khoản? Đăng ký
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
