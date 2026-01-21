import prisma from '../db/prisma';

//Create a team and add owner as member

export async function createTeam(teamName: string, ownerUserId: number) {
  return prisma.team.create({
    data: {
      name: teamName,
      members: {
        create: {
          userId: ownerUserId,
        },
      },
    },
  });
}

//add users to team

export async function addUsertoTeam(userId: number, teamId: number) {
  return prisma.teamMember.create({
    data: {
      userId,
      teamId,
    },
  });
}

//Get team of a user

export async function getTeamByUser(userId: number) {
  return prisma.teamMember.findMany({
    where: { userId },
    include: {
      team: true,
    },
  });
}

export async function getTeamByName(name: string) {
  return prisma.team.findMany({
    where: { name }
  });
}

export async function listTeams(userId: number) {
  return prisma.teamMember.findMany({
    where: {
      userId: userId,
    },
    include: {
      team: true,
    },
  });
}
