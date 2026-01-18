import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { getAuthToken } from '../config/auth.config';

const DATA_DIR = path.join(process.cwd(), '.teams');
const REPO_FILE = path.join(DATA_DIR, 'repos.json');

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }

  if (!fs.existsSync(REPO_FILE)) {
    fs.writeFileSync(REPO_FILE, JSON.stringify([]));
  }
}

function readRepos() {
  ensureStorage();
  return JSON.parse(fs.readFileSync(REPO_FILE, 'utf-8'));
}

function writeRepos(data: any[]) {
  fs.writeFileSync(REPO_FILE, JSON.stringify(data, null, 2));
}

/*
 * Verify repo exists on GitHub
 */
async function verifyRepo(owner: string, repo: string) {
  const token = getAuthToken();

  await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
}

/*
 * Connect a GitHub repo
 */
export async function connectRepo({
  owner,
  repo,
  isPrivate,
}: {
  owner: string;
  repo: string;
  isPrivate: boolean;
}) {
  await verifyRepo(owner, repo);

  const repos = readRepos();

  const exists = repos.find((r: any) => r.owner === owner && r.repo === repo);

  if (exists) {
    throw new Error('Repository already connected');
  }

  repos.push({
    owner,
    repo,
    private: isPrivate,
    connectedAt: new Date().toISOString(),
  });

  writeRepos(repos);
}

//Disconnect repo

export async function disconnectRepo(repoName: string) {
  const repos = readRepos();

  const filtered = repos.filter((r: any) => r.repo !== repoName);

  writeRepos(filtered);
}

//List connected repos
export async function listRepos() {
  return readRepos();
}
