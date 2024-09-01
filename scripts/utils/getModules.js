import fs from 'fs';
import path from 'path';

export const getModules = async (dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  if (files.length === 0) return;

  const modules = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(dir, file);
    const name = path.basename(file).replace(path.extname(file), '');
    if (fs.lstatSync(filePath).isDirectory()) {
      const children = await getModules(filePath);
      if (children) {
        modules[name] = children;
      }
    } else {
      modules[name] = await import('../../' + filePath);
    }
  }
  if (Object.keys(modules) === 0) return;
  return modules;
}