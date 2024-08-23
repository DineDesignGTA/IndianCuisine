import { Octokit } from "@octokit/rest";
import { NextResponse } from 'next/server';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const path = 'src/app/Data/title.json';

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
    console.error('Error reading title data:', error);
    return NextResponse.json({ error: 'Failed to read title data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { data: existingFile } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: 'Update title data via CMS',
      content: Buffer.from(JSON.stringify(body, null, 2)).toString('base64'),
      sha: existingFile.sha,
    });

    return NextResponse.json({ message: 'title data updated successfully' });
  } catch (error) {
    console.error('Error updating title data:', error);
    return NextResponse.json({ error: 'Failed to update hour data' }, { status: 500 });
  }
}