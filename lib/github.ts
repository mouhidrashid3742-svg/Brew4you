// use global fetch available in Next.js runtime

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // owner/repo
const COMMITTER_NAME = process.env.GITHUB_COMMITTER_NAME || '9 BAR Admin';
const COMMITTER_EMAIL = process.env.GITHUB_COMMITTER_EMAIL || 'admin@9bar.pk';

if (!GITHUB_REPO) {
  // not throwing here because some environments (local) may not have it set
}

export async function getFileSha(path: string, branch = 'main') {
  if (!GITHUB_TOKEN || !GITHUB_REPO) return null;
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json'
    }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha;
}

export async function commitFile(path: string, content: string, message: string, branch = 'main') {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error('GITHUB_TOKEN or GITHUB_REPO not configured');
  }

  const sha = await getFileSha(path, branch);
  const encoded = Buffer.from(content).toString('base64');

  const payload: any = {
    message,
    content: encoded,
    branch,
    committer: {
      name: COMMITTER_NAME,
      email: COMMITTER_EMAIL
    }
  };

  if (sha) payload.sha = sha;

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const body = await res.json();
  if (!res.ok) {
    const err = body && body.message ? body.message : `GitHub API error ${res.status}`;
    throw new Error(err);
  }

  return body;
}

export async function makeRepoPrivate() {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error('GITHUB_TOKEN or GITHUB_REPO not configured');
  }
  const url = `https://api.github.com/repos/${GITHUB_REPO}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ private: true })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Failed to make repo private');
  return body;
}

export default { commitFile, makeRepoPrivate };
