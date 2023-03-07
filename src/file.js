import fs from "fs/promises";
import path from "path";

import { filesPath } from "./paths.js";

const getFileList = async filesPath => {
  try {
    return (await fs.readdir(filesPath, { withFileTypes: true }))
      .filter(file => file.isFile())
      .map(file => file.name);
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getPersonalFilesNames = async user => {
  const userPath = getPersonalFilePath(user);
  return await getFileList(userPath);
};

export const getCommonFilesNames = async userType => {
  const commonPath = getCommonFilePath(userType);

  console.log(commonPath, await getFileList(commonPath));

  return await getFileList(commonPath);
};

export const getPersonalFilePath = user => {
  const parentFolder = user.admin === 1 ? "admin" : "user";
  const userFolder = user.userName;

  const userPath = path.join(filesPath, parentFolder, userFolder);

  return userPath;
};

export const getCommonFilePath = userType => {
  const parentFolder = userType === 1 ? "admin" : "user";

  const commonPath = path.join(filesPath, parentFolder);

  return commonPath;
};
