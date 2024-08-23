import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

export async function POST(request) {
  try {

  const formData = await request.formData();
  const file = formData.get('file');
  const oldImage = formData.get('oldImage');
  const googleImageLink = formData.get('googleImageLink');

  let buffer;
  let filename;

  if (file) {
    buffer = await file.arrayBuffer();
    filename = file.name;
  } else if (googleImageLink) {
    const response = await axios.get(googleImageLink, { responseType: 'arraybuffer' });
    buffer = response.data;
    filename = path.basename(new URL(googleImageLink).pathname);
  } else {
    return NextResponse.json({ error: 'No file or image link provided' }, { status: 400 });
  }

  const uploadPath = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const filePath = path.join(uploadPath, filename);
  fs.writeFileSync(filePath, Buffer.from(buffer));

  // Check if the old image is used elsewhere before deleting
  const isImageUsedElsewhere = async (oldImage) => {
    const jsonFiles = ['slider.json', 'menu.json', 'contact.json'];
    for (const file of jsonFiles) {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: `src/app/Data/${file}`,
      });
      const content = JSON.parse(Buffer.from(data.content, 'base64').toString());
      if (JSON.stringify(content).includes(oldImage)) {
        return true;
      }
    }
    return false;
  };

  // Delete old image if it exists and is not used elsewhere
  if (oldImage && oldImage.startsWith('/uploads/')) {
    const oldImagePath = path.join(process.cwd(), 'public', oldImage);
    const isUsedElsewhere = await isImageUsedElsewhere(oldImage);
    if (fs.existsSync(oldImagePath) && !isUsedElsewhere) {
      fs.unlinkSync(oldImagePath);
      // Delete from GitHub
      const oldImageGitHubPath = `public${oldImage}`;
      try {
        const { data: existingFile } = await octokit.repos.getContent({
          owner,
          repo,
          path: oldImageGitHubPath,
        });
        await octokit.repos.deleteFile({
          owner,
          repo,
          path: oldImageGitHubPath,
          message: `Delete unused image: ${path.basename(oldImage)}`,
          sha: existingFile.sha,
        });
      } catch (error) {
        console.error('Error deleting old image from GitHub:', error);
      }
    }
  }

  // Push new image to GitHub
  try {
    const content = Buffer.from(buffer).toString('base64');
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `public/uploads/${filename}`,
      message: `Upload image: ${filename}`,
      content,
      sha: '', // New file, so no SHA
    });

    console.log('Image uploaded to GitHub successfully');
  } catch (error) {
    console.error('Error pushing image to GitHub:', error);
    return NextResponse.json({ error: 'Failed to upload image to GitHub', details: error.message }, { status: 500 });
  }

  // Update local file
  const localUploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
  fs.writeFileSync(localUploadPath, buffer);
  console.log('Image saved locally');

  return NextResponse.json({ filePath: `/uploads/${filename}` });
} catch (error) {
  console.error('Error handling image upload:', error);
  return NextResponse.json({ error: 'Failed to handle image upload', details: error.message }, { status: 500 });
}
}
