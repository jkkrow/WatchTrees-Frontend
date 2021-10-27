export const formatTime = (timeInSeconds: number): string => {
  const result = new Date(Math.round(timeInSeconds) * 1000)
    .toISOString()
    .substr(11, 8);
  // if duration is over hour
  if (+result.substr(0, 2) > 0) {
    // show 00:00:00
    return result;
  } else {
    // else show 00:00
    return result.substr(3);
  }
};

export const formatSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatString = (string: string): string => {
  const convertedString = string.trim().replace(/[^a-zA-Z0-9 ]/g, '');

  return convertedString.charAt(0).toUpperCase() + convertedString.slice(1);
};

export const formatNumber = (number: number, decimal = 0): string => {
  const convertedNumber = (
    Math.round(number * 10 ** decimal) /
    10 ** decimal
  ).toFixed(decimal);

  const intDec = convertedNumber.split('.');
  intDec[0] = intDec[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return intDec.join('.');
};
