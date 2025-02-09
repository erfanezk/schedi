import { ICallback } from '@/interfaces';

class FunctionSerializer {
  /**
   * Converts a function to a string representation.
   * @param func The function to convert.
   * @returns A string representation of the function.
   */
  functionToString(func: ICallback): string {
    if (typeof func !== 'function') {
      throw new Error('Provided value is not a function');
    }
    return func.toString(); // Serialize the function
  }

  /**
   * Converts a string back into a function.
   * @param funcString The string representation of the function.
   * @returns The reconstructed function.
   */
  stringToFunction(funcString: string): ICallback {
    try {
      /* eslint-disable no-new-func */
      return new Function(`return (${funcString})`)(); //TODO find safer way to store callback
    } catch (error) {
      throw new Error('Invalid function string');
    }
  }
}

const functionSerializer = new FunctionSerializer();

export default functionSerializer;
