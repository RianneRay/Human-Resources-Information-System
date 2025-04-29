import { registerUser, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  if (!result) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ token: result.token, user: result.user });
};