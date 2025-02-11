const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function secondsToMilliseconds(seconds: number) {
  return seconds * 1000;
}

export { wait, secondsToMilliseconds };
