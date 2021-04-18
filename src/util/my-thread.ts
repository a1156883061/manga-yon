import { ModuleThread, Pool, spawn, Worker } from 'threads';
import { cpus } from 'os';
import { TaskRunFunction } from 'threads/dist/master/pool-types';

type sortArrayFun = (dirPath: string, files: string[]) => string[];

type typedThread = ModuleThread<{ sortArray: sortArrayFun }>;

function initThread() {
  return spawn<{
    sortArray: (dirPath: string, files: string[]) => string[];
  }>(new Worker('../worker/sort-array.ts', { type: 'module' }));
}

const pool = Pool(initThread, { size: cpus().length * 2 });

export async function runTask(task: TaskRunFunction<typedThread, unknown>) {
  pool.queue(task);
}
