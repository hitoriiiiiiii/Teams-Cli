import inquirer from "inquirer";

/**
 * Ask for GitHub repository details
 */
export async function askRepoDetails() {
  return inquirer.prompt([
    {
      type: "input",
      name: "owner",
      message: "GitHub owner (username or org):",
      validate: (input: string) =>
        input.trim() !== "" || "Owner cannot be empty",
    },
    {
      type: "input",
      name: "repo",
      message: "Repository name:",
      validate: (input: string) =>
        input.trim() !== "" || "Repository name cannot be empty",
    },
    {
      type: "confirm",
      name: "isPrivate",
      message: "Is this a private repository?",
      default: false,
    },
  ]);
}

/**
 * Ask user to select a repository from a list
 */
export async function selectRepo(repos: string[]) {
  return inquirer.prompt([
    {
      type: "list",
      name: "repo",
      message: "Select a repository:",
      choices: repos,
    },
  ]);
}

/**
 * Confirm dangerous actions (delete, disconnect, leave team)
 */
export async function confirmAction(message: string) {
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message,
      default: false,
    },
  ]);

  return confirm;
}

/**
 * Ask for team name
 */
export async function askTeamName() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter team name:",
      validate: (input: string) =>
        input.trim() !== "" || "Team name cannot be empty",
    },
  ]);
}

/*
 * Ask for GitHub username
 */
export async function askGithubUsername() {
  return inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "GitHub username:",
      validate: (input: string) =>
        input.trim() !== "" || "Username cannot be empty",
    },
  ]);
}
