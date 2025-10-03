import { useAuth } from "@/hooks/useAuth";
import type { RegisterRequest } from "@/interface/userInterface";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";

// Validation schema
const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự"),
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: yup
    .string()
    .required("Xác nhận mật khẩu là bắt buộc")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      setError("");
      await registerUser(data);
      navigate("/login");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const error = err as { response?: { data?: { message?: string } } };
        if (
          error.response?.data?.message?.includes("duplicate") ||
          error.response?.data?.message?.includes("already exists")
        ) {
          setError("Email đã được sử dụng. Vui lòng sử dụng email khác.");
        } else {
          setError(
            error.response?.data?.message ||
              "Đăng ký thất bại. Vui lòng thử lại."
          );
        }
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Đăng Ký
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Tên"
              autoComplete="name"
              autoFocus
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              autoComplete="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Xác nhận mật khẩu"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng Ký"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Đã có tài khoản? Đăng nhập ngay
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
