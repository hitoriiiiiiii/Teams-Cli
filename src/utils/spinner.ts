import ora from 'ora';

export function startSpinner(text: string) {
  return ora(text).start();
}
