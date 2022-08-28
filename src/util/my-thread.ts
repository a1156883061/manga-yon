import { ModuleThread, Pool, spawn, Worker } from 'threads';
import { cpus } from 'os';
import { TaskRunFunction } from 'threads/dist/master/pool-types';
import { ThreadsWorkerOptions } from 'threads/dist/types/master';

type sortArrayFun = (dirPath: string, files: string[]) => string[];

type typedThread = ModuleThread<{ sortArray: sortArrayFun }>;

function initThread() {
  return spawn<{
    sortArray: (dirPath: string, files: string[]) => string[];
  }>(
    new Worker(
      new URL('../worker/sort-array.ts') as unknown as string,
      import.meta.url as unknown as ThreadsWorkerOptions
    )
  );
}

const pool = Pool(initThread, { size: cpus().length * 2 });

export async function runTask(task: TaskRunFunction<typedThread, unknown>) {
  pool.queue(task);
}
