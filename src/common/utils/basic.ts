/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  return (
    value === null ||
    (typeof value !== 'number' && value === '') ||
    typeof value === 'undefined' ||
    value === undefined ||
    (value !== null && typeof value === 'object' && !Object.keys(value).length)
  );
};
