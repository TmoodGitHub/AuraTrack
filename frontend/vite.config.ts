import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import graphql from '@rollup/plugin-graphql';

export default defineConfig({
  plugins: [react(), graphql()],
});
