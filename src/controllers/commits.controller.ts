import axios from 'axios';
import prisma from '../db/prisma';

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  files?: string[];
  createdAt?: Date;
}

// Fetch all commits from GitHub
export async function getCommits(
  owner: string,
  repo: string,
  author?: string,
): Promise<GitHubCommit[]> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits${
      author ? `?author=${author}` : ''
    }`;
    const response = await axios.get(url);

    return response.data.map((c: any) => ({
      sha: c.sha,
      message: c.commit.message,
      author: c.commit.author.name,
      date: c.commit.author.date,
      files: c.files?.map((f: any) => f.filename) || [],
    }));
  } catch (err: any) {
    console.error('❌ Failed to fetch commits from GitHub:', err.message);
    return [];
  }
}

// Fetch a single commit, first from DB, then GitHub if not found
export async function getCommit(owner: string, repo: string, sha: string) {
  try {
    // 1. Try DB
    let commit = await prisma.commit.findUnique({ where: { sha } });

    if (commit) {
      return { ...commit, source: 'db' };
    }

    // 2. Fetch from GitHub
    const githubCommits = await getCommits(owner, repo);
    const ghCommit = githubCommits.find((c) => c.sha === sha);

    if (!ghCommit) return null;

    // 3. Try to find repo in DB (optional: only save if repo exists)
    const repoRecord = await prisma.repo.findFirst({
      where: { fullName: `${owner}/${repo}` },
    });

    // Only save to DB if repo exists in database
    if (repoRecord) {
      try {
        await prisma.commit.create({
          data: {
            sha: ghCommit.sha,
            message: ghCommit.message,
            repoId: repoRecord.id,
            createdAt: new Date(ghCommit.date),
          },
        });
      } catch (dbErr: any) {
        // Log but don't fail if commit already exists
        if (!dbErr.message?.includes('Unique constraint failed')) {
          console.warn('⚠️ Could not save commit to DB:', dbErr.message);
        }
      }
    }

    return { ...ghCommit, source: 'github' };
  } catch (err: any) {
    console.error('❌ Failed to fetch commit:', err.message);
    return null;
  }
}
