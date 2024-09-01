import fs from 'fs';
import path from 'path';

export const getModules = async (dir, pattern = /\.test\.js$/, replacement = '') => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  if (files.length === 0) return;

  const modules = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      const children = await getModules(filePath);
      if (children) {
        modules[file] = children;
      }
    } else {
      if (pattern.test(file)) {
        const name = file.replace(pattern, replacement);
        modules[name] = await import('../../' + filePath);
      }
    }
  }
  if (Object.keys(modules) === 0) return;
  return modules;
}