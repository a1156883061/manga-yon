import {
  addRxPlugin,
  createRxDatabase,
  RxCollection,
  RxDatabase,
  RxJsonSchema,
} from 'rxdb';
import { join } from 'path';
import currentFolder from '@/util/get-exec-folder';
import levelDBPlugin from 'pouchdb-adapter-leveldb';
import leveldown from 'leveldown';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
import IdGenerator from '@/main/util/IdGenerator';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
type ComicDocType = {
  id?: string;
  title: string;
  path: string[];
};
type ComicCollection = RxCollection<ComicDocType>;
type MyDatabaseCollections = {
  comics: ComicCollection;
};
type MyDatabase = RxDatabase<MyDatabaseCollections>;
console.log('path', join(currentFolder, 'comicData'));
addRxPlugin(RxDBValidatePlugin);
addRxPlugin(levelDBPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
const comics = (async function() {
  const db: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
    name: join(currentFolder, 'comicData'),
    adapter: leveldown,
  });
  const comicSchema: RxJsonSchema<ComicDocType> = {
    title: 'comic shelf data',
    description: 'comic shelf data, include title, comic path in desk and etc ',
    type: 'object',
    version: 0,
    properties: {
      id: {
        type: 'string',
        primary: true,
      },
      title: {
        type: 'string',
      },
      path: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  };
  await db.addCollections({
    comics: {
      schema: comicSchema,
    },
  });
  IdGenerator(db.comics);
  return db.comics;
})();
export { comics };
