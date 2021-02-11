import { RxCollection } from 'rxdb';

export default async function(rxCollection: RxCollection) {
  const lastIdDocument = await rxCollection
    .findOne()
    .sort({ id: 'desc' })
    .exec();
  let lastId = 0;
  if (lastIdDocument != null) {
    lastId = lastIdDocument.get('id');
  }
  rxCollection.preInsert((data) => {
    if (data.id) {
      return;
    }
    lastId += 1;
    data.id = lastId;
  }, false);
}
