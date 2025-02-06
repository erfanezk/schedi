import { v4 as uuidv4 } from 'uuid';

export class CommonUtils {
  static generateUniqueId() {
    return uuidv4();
  }
}
