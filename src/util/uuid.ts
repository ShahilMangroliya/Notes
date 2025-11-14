import {v4 as uuidv4} from 'uuid';

/**
 * Generates a UUID v4
 * @returns UUID string
 */
export const generateId = (): string => {
  return uuidv4();
};

export default generateId;
