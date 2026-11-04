import { useState, useEffect } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Chip,
} from "@mui/material"
import axios from "axios"

const ProjectsList = () => {
  const [projects, setProjects] = useState([])
  const [editingId, setEditingId] = useState(null)

  // States cho Form
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("private")

  // State quản lý danh sách kỹ năng
  const [skills, setSkills] = useState([])
  const [currentSkillName, setCurrentSkillName] = useState("")
  const [currentSkillLevel, setCurrentSkillLevel] = useState("Beginner") // Đã cập nhật mặc định

  // Khai báo hàm fetchProjects
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:8017/v1/projects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      setProjects(res.data)
    } catch (error) {
      console.error("Lỗi lấy dự án:", error)
    }
  }

  // Gọi trong useEffect
  useEffect(() => {
    fetchProjects()
  }, [])

  // Xử lý thêm kỹ năng tạm vào danh sách
  const handleAddSkill = () => {
    if (currentSkillName.trim()) {
      setSkills([
        ...skills,
        { skillName: currentSkillName.trim(), level: currentSkillLevel },
      ])
      setCurrentSkillName("")
    }
  }

  // Xóa kỹ năng khỏi danh sách tạm
  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove))
  }

  // Xử lý Lưu (Tạo mới hoặc Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { name, description, type, requiredSkills: skills }
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8017/v1/projects/${editingId}`,
          payload,
          { headers },
        )
      } else {
        await axios.post("http://localhost:8017/v1/projects", payload, {
          headers,
        })
      }
      resetForm()
      fetchProjects()
    } catch (error) {
      console.error("Lỗi lưu dự án:", error)
    }
  }

  // Đổ dữ liệu lên form để Sửa
  const handleEditClick = (project) => {
    setEditingId(project._id)
    setName(project.name)
    setDescription(project.description)
    setType(project.type)
    setSkills(project.requiredSkills || [])
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Gọi API Xóa
  const handleDeleteClick = async (projectId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      try {
        await axios.delete(`http://localhost:8017/v1/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        fetchProjects()
      } catch (error) {
        console.error("Lỗi xóa dự án:", error)
      }
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setName("")
    setDescription("")
    setType("private")
    setSkills([])
    setCurrentSkillName("")
    setCurrentSkillLevel("Beginner")
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" fontWeight="bold" color="primary" mb={4}>
        Quản lý Dự án (Projects)
      </Typography>

      {/* Form Nhập Liệu */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mb: 6, p: 3, border: "1px solid #ccc", borderRadius: 2 }}
      >
        <Typography variant="h6" mb={2}>
          {editingId ? "Cập nhật Dự án" : "Tạo Dự án Mới"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Tên dự án"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Quyền truy cập"
              value={type}
              onChange={(e) => setType(e.target.value)}
              size="small"
            >
              <MenuItem value="private">Private (Nội bộ)</MenuItem>
              <MenuItem value="public">Public (Công khai)</MenuItem>
            </TextField>
          </Grid>

          {/* Phần Nhập Yêu Cầu Kỹ Năng */}
          <Grid
            item
            xs={12}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <TextField
              label="Tên kỹ năng (VD: ReactJS)"
              size="small"
              value={currentSkillName}
              onChange={(e) => setCurrentSkillName(e.target.value)}
            />
            {/* Đã cập nhật 4 cấp độ chuẩn */}
            <TextField
              select
              label="Trình độ"
              size="small"
              value={currentSkillLevel}
              onChange={(e) => setCurrentSkillLevel(e.target.value)}
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
              <MenuItem value="Expert">Expert</MenuItem>
            </TextField>
            <Button variant="outlined" onClick={handleAddSkill}>
              Thêm Kỹ Năng
            </Button>
          </Grid>

          <Grid item xs={12} display="flex" gap={1} flexWrap="wrap">
            {skills.map((s, index) => (
              <Chip
                key={index}
                label={`${s.skillName} - ${s.level}`}
                onDelete={() => handleRemoveSkill(index)}
                color="info"
              />
            ))}
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color={editingId ? "warning" : "primary"}
            >
              {editingId ? "Lưu Thay Đổi" : "Tạo Dự Án"}
            </Button>
            {editingId && (
              <Button onClick={resetForm} sx={{ ml: 2 }}>
                Hủy
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Danh sách dự án hiển thị dạng thẻ */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {project.name}
                  </Typography>
                  <Chip
                    label={project.type === "public" ? "Public" : "Private"}
                    color={project.type === "public" ? "success" : "default"}
                    size="small"
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {project.description}
                </Typography>

                {/* Hiển thị kỹ năng trên Card */}
                <Box display="flex" gap={0.5} flexWrap="wrap">
                  {project.requiredSkills?.map((s, idx) => (
                    <Chip
                      key={idx}
                      label={`${s.skillName} (${s.level})`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
              <Box sx={{ p: 2, pt: 0, display: "flex", gap: 1 }}>
                <Button size="small" variant="contained" sx={{ flexGrow: 1 }}>
                  Vào Dự án
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => handleEditClick(project)}
                >
                  Sửa
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteClick(project._id)}
                >
                  Xóa
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ProjectsList
