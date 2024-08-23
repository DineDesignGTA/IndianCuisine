import { Octokit } from "@octokit/rest";
import { NextResponse } from 'next/server';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const path = 'src/app/Data/contact.json';

export async function GET() {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    const content = Buffer.from(data.content, 'base64').toString();
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error('Error reading contact data:', error);
    return NextResponse.json({ error: 'Failed to read contact data' }, { status: 500 });
  }
}

async function updateLocalJson(content) {
  const localPath = path.join(process.cwd(), 'src', 'app', 'Data', path.basename(path));
  fs.writeFileSync(localPath, JSON.stringify(content, null, 2));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { data: existingFile } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    const content = Buffer.from(JSON.stringify(body, null, 2)).toString('base64');

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: 'Update data via CMS',
      content,
      sha: existingFile.sha,
    });

    // Update local JSON file
    await updateLocalJson(body);

    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}