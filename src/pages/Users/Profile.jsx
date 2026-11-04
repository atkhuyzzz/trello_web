import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material"
import { getProfileAPI, updateProfileAPI } from "~/apis"

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"]

const LEVEL_COLOR_MAP = {
  Beginner: "default",
  Intermediate: "info",
  Advanced: "primary",
  Expert: "success",
}

function Profile() {
  const [profile, setProfile] = useState(null)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [skills, setSkills] = useState([])

  const [skillName, setSkillName] = useState("")
  const [skillLevel, setSkillLevel] = useState("Intermediate")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState({ type: "", text: "" })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getProfileAPI()
        setProfile(data)
        setDisplayName(data.displayName || "")
        setBio(data.bio || "")
        setSkills(data.skills || [])
      } catch (err) {
        setFeedback({
          type: "error",
          text: err.response?.data?.message || "Không thể tải thông tin hồ sơ.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const handleAddSkill = () => {
    if (!skillName.trim()) return
    const isExisted = skills.some(
      (s) => s.name.toLowerCase() === skillName.trim().toLowerCase(),
    )
    if (isExisted) {
      setFeedback({
        type: "warning",
        text: "Kỹ năng này đã tồn tại trong danh sách!",
      })
      return
    }
    setSkills([...skills, { name: skillName.trim(), level: skillLevel }])
    setSkillName("")
    setFeedback({ type: "", text: "" })
  }

  const handleDeleteSkill = (targetIndex) => {
    setSkills(skills.filter((_, idx) => idx !== targetIndex))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFeedback({ type: "", text: "" })

    try {
      const updated = await updateProfileAPI({
        displayName,
        bio,
        avatar: profile?.avatar,
        skills,
      })
      setProfile(updated)
      localStorage.setItem("userInfo", JSON.stringify(updated))
      setFeedback({
        type: "success",
        text: "Cập nhật thông tin hồ sơ thành công!",
      })
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Có lỗi xảy ra khi lưu.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, mb: 6, p: 2 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          {/* Header thông tin tài khoản */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar
              src={profile?.avatar}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "primary.main",
                fontSize: 24,
              }}
            >
              {profile?.displayName?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {profile?.displayName || profile?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{profile?.username} • Vai trò: <strong>{profile?.role}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.email}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {feedback.text && (
            <Alert severity={feedback.type} sx={{ mb: 3 }}>
              {feedback.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSave}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Thông tin cơ bản
            </Typography>

            <TextField
              label="Tên hiển thị (Display Name)"
              fullWidth
              size="small"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              label="Tiểu sử / Giới thiệu (Bio)"
              fullWidth
              multiline
              rows={3}
              placeholder="Chia sẻ ngắn về vai trò hoặc kinh nghiệm..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Kỹ năng & Cấp độ
            </Typography>

            {/* Khối thêm kỹ năng */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ mb: 2 }}
            >
              <TextField
                size="small"
                label="Tên kỹ năng (VD: React, Node.js, C++)"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Trình độ</InputLabel>
                <Select
                  value={skillLevel}
                  label="Trình độ"
                  onChange={(e) => setSkillLevel(e.target.value)}
                >
                  {SKILL_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" onClick={handleAddSkill}>
                Thêm Kỹ Năng
              </Button>
            </Stack>

            {/* Danh sách chip hiển thị */}
            <Box
              sx={{
                p: 2,
                mb: 3,
                bgcolor: "action.hover",
                borderRadius: 2,
                minHeight: 56,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {skills.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ alignSelf: "center" }}
                >
                  Chưa có kỹ năng nào được lưu.
                </Typography>
              ) : (
                skills.map((item, index) => (
                  <Chip
                    key={index}
                    label={`${item.name} — ${item.level}`}
                    color={LEVEL_COLOR_MAP[item.level] || "primary"}
                    variant="filled"
                    onDelete={() => handleDeleteSkill(index)}
                  />
                ))
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={saving}
              sx={{ py: 1.2, fontWeight: 700 }}
            >
              {saving ? "Đang lưu..." : "Lưu Thay Đổi Hồ Sơ"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Profile
