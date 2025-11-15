import { IncomingForm } from 'formidable';
import fs from 'fs';

export default defineEventHandler(async (event) => {
  const { fastGptApiKey, fastGptApiBase } = useRuntimeConfig();

  const form = new IncomingForm();

  // 使用 Promise 包装 formidable 的回调式 API
  const filePromise = new Promise<{ file: any }>((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) {
        return reject(createError({ statusCode: 500, statusMessage: 'File parsing error' }));
      }
      // formidable v3/v4 中，文件在 files 对象下，可能是数组
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        return reject(createError({ statusCode: 400, statusMessage: 'No file uploaded' }));
      }
      resolve({ file });
    });
  });

  try {
    const { file } = await filePromise;

    const formData = new FormData();
    // 从临时路径读取文件内容创建 Blob
    const fileBlob = new Blob([fs.readFileSync(file.filepath)], { type: file.mimetype });
    formData.append('file', fileBlob, file.originalFilename || 'upload.tmp');

    // 假设 FastGPT 的文件上传端点为 /v1/files
    const response = await fetch(`${fastGptApiBase}/v1/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${fastGptApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw createError({ statusCode: response.status, statusMessage: `FastGPT File API Error: ${errorBody}` });
    }

    const result = await response.json();
    return result; // 预期返回包含 { id: '...' } 的对象
    
  } catch (error: any) {
    console.error('File upload proxy error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error during file upload',
    });
  }
});