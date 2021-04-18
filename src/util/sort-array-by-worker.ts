import { runTask } from './my-thread';

async function sortArrayByWorker(dirName: string, array: string[]) {
  // const sortWorker = await getThread();
  const promiseResult = new Promise((resolve) => {
    runTask(async (worker) => {
      resolve(worker.sortArray(dirName, array));
    });
  });
  const result = await promiseResult;
  return result;
}

export default sortArrayByWorker;
