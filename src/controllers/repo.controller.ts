import prisma from '../db/prisma';

//create or update repo

export async function upsertRepo(teamId: number, repoName: string) {
  return prisma.repo.upsert({
    where: {
      teamId_name: {
        teamId,
        name: repoName,
      },
    },
    update: {},
    create: {
      name: repoName,
      teamId,
    },
  });
}

//get all repos of the team

export async function getReposByTeam(teamId: number) {
  return prisma.repo.findMany({
    where: { teamId },
  });
}
