import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Aquí iría la lógica de autenticación
  if (username === 'admin' && password === 'password') {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  // Aquí iría la lógica de registro
  res.status(201).json({ message: 'User registered successfully' });
});

export default router;
