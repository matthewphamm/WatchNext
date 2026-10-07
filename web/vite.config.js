import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins:[react()],
  // The FastAPI backend (backend/) runs on :8000 during development.
  server:{proxy:{'/api':'http://localhost:8000'}}
});
