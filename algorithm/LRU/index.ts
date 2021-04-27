import LRUArray from './LRU.Array';
import LRULinklist from './LRU.Linklist';

const lrcArray = new LRUArray(5000);
console.time('lrcArrayset');
for (let i = 0; i < 10000; i++) {
  lrcArray.setRecord(i, {
    id: i,
    application: String(Math.random()),
  });
}
console.timeEnd('lrcArrayset');

console.time('lrcArrayupdate');
for (let i = 0; i < 10000; i++) {
  lrcArray.setRecord(i, {
    id: i,
    application: String(Math.random()),
  });
}
console.timeEnd('lrcArrayupdate');

console.log(`size: ${lrcArray.records.length}`)
console.log('\r---------------------\r');
const lrc = new LRULinklist<number>(10);
for (let i = 0; i < 10; i++) {
  lrc.put(String(i), i);
}
console.log(lrc.LinkedListNodeMap);