import { v4 as uuidv4 } from 'uuid';

export function simpleUuid() {
  return uuidv4().replace(/-/g, '');
}
