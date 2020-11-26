import { spawn, Thread, Worker } from 'threads';

async function sortArrayByWorker(dirName: string, array: string[]) {
  const sortWorker = await spawn<{
    sortArray: (dirPath: string, files: string[]) => string[];
  }>(new Worker('../worker/sort-array.ts', { type: 'module' }));
  const result = await sortWorker.sortArray(dirName, array);
  await Thread.terminate(sortWorker);
  return result;
}

export default sortArrayByWorker;
