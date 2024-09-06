import { webRequest } from '../src/index.js';

const url = new URL('https://api.github.com/repos/CodeJamboree/web-request-queue');
const options = { headers: { 'user-agent': '@CodeJamboree/Web-Request-Queue' } };

interface GitRepo {
  name: string,
  private: boolean,
  html_url: string,
  created_at: string
}

const revivor = (key: string, value: any) => {
  if (key.endsWith('_at')) return new Date(value);
  return value;
}

Promise.all([
  webRequest.parseJson<GitRepo>(url, options),
  webRequest.parseJsonWithReviver<GitRepo>(revivor, url, options)
])
  .then(repos => {
    repos.forEach(repo => {
      console.group(repo.name);
      console.log('URL', repo.html_url);
      console.log('Private', repo.private);
      console.log('Created', repo.created_at, typeof repo.created_at);
      console.groupEnd();
    });
  })
  .catch(err => console.error(err))
  .finally(() => console.log('done'));