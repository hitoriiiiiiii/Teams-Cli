import chalk from 'chalk';
import { getAuthToken } from '../config/auth.config';

//Ensure user is authenticated before running a comman

export function requireAuth() {
  const token = getAuthToken();

  if (!token) {
    console.log(chalk.red('❌ You are not logged in'));
    console.log(
      chalk.yellow('👉 Run `teams login` to authenticate with GitHub'),
    );
    process.exit(1);
  }

  return token;
}
