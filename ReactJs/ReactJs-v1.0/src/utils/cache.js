import { cacheTypes } from '../constants/cacheTypes';

const cachedCollections = [];

export const getCachedCollection = (collectionName) => {
  if (!cachedCollections[collectionName]) {
    cachedCollections[collectionName] = [];
  }
  return cachedCollections[collectionName];
};

export const needCache = (path) => {
  const numberCacheTypes = cacheTypes.length;
  for (let i = 0; i < numberCacheTypes; i++) {
    if (path.indexOf(cacheTypes[i] !== -1)) return true;
  }
  return false;
};

export default {
  getCachedCollection,
  needCache
};
