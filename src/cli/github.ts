import axios from 'axios';
import chalk from 'chalk';
import { getAuthToken } from '../config/auth.config';

export async function getGithubUser() {
  const token = getAuthToken();

  if (!token) {
    console.log(chalk.red('❌ Not logged in. Run `teams login` first.'));
    return;
  }

  try {
    const res = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    const user = res.data;

    console.log(chalk.green('✅ GitHub Profile'));
    console.log(`Username : ${user.login}`);
    console.log(`Name     : ${user.name}`);
    console.log(`Email    : ${user.email ?? 'Private'}`);
  } catch (err: any) {
    console.log(chalk.red('❌ Failed to fetch GitHub profile'));
    console.error(err.message);
  }
}
