import { Octokit } from "@octokit/rest";
import { NextResponse } from 'next/server';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const path = 'src/app/Data/slider.json';

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
    console.error('Error reading slider data:', error);
    return NextResponse.json({ error: 'Failed to read slider data' }, { status: 500 });
  }
}

async function updateLocalJson(content, filename) {
  try {
    const localPath = path.join(process.cwd(), 'src', 'app', 'Data', filename);
    await fs.writeFile(localPath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`Local file ${filename} updated successfully`);
  } catch (error) {
    console.error(`Error updating local file ${filename}:`, error);
    throw error;
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
    const filename = path.split('/').pop(); // Get the filename from the path
    await updateLocalJson(body, filename);

    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update data', details: error.message }, { status: 500 });
  }
}