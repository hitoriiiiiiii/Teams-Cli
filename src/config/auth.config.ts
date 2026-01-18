import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.mycli');
const CONFIG_FILE = path.join(CONFIG_DIR, 'auth.json');

export function saveAuthToken(token: string) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ token }, null, 2), 'utf-8');
}

export function getAuthToken(): string | null {
  if (!fs.existsSync(CONFIG_FILE)) return null;

  const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));

  return data.token || null;
}

export function clearAuthToken() {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
  }
}
