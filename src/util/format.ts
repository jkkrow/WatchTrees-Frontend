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
  if (bytes === 0) return '0 B';

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

export const formatNumber = (number: number, digits = 1) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => number >= item.value);
  return item
    ? (number / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
};
