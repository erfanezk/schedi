/**
 * @schedi/react
 * React bindings for schedi
 */

import { greeting } from '@schedi/core';

export const useSchedi = () => {
  return {
    message: `${greeting()} - React integration ready!`,
  };
};

export { greeting };

