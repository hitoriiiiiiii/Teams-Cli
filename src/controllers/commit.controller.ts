import prisma from '../db/prisma';

/**
 * Create commit if not exists
 */
export async function upsertCommit(
  repoId: number,
  sha: string,
  message: string,
) {
  return prisma.commit.upsert({
    where: { sha },
    update: {},
    create: {
      sha,
      message,
      repoId,
    },
  });
}

// get commits

export async function getCommitsByRepo(repoId: number) {
  return prisma.commit.findMany({
    where: { repoId },
    orderBy: { createdAt: 'desc' },
  });
}
