import { IRecord } from '../../typings';

interface ITimes {
  latestUsedTime: number;
}

/**
 * @description 缓存淘汰策略
 * @date 2021-03-26
 * @class LRU
 */
class LRUArray {
  limit: number;
  records: (IRecord & ITimes)[];

  constructor(limit: number = 10) {
    this.limit = limit;
    this.records = [];
  }

  setRecord(key: number, record: IRecord) {
    const length: number = this.records.length;
    const newRecord = {
      ...record,
      latestUsedTime: +new Date(),
    };
    const _record = this.getRecord(key);
    if (length + 1 > this.limit) {
      const earliestUsed = this.records.sort(
        (a: IRecord & ITimes, b: IRecord & ITimes) => {
          if (a.latestUsedTime < b.latestUsedTime) {
            return -1;
          }
        }
      )[0];
      const index = this.records.findIndex(
        (v) => v.id === (_record ? _record.id : earliestUsed.id)
      );
      this.records.splice(index, 1);
      this.records.push(newRecord);
    } else {
      if (_record) {
        const index = this.records.findIndex((v) => v.id === _record.id);
        this.records.splice(index, 1);
      }
      this.records.push(newRecord);
    }
  }

  getRecord(id: number): IRecord & ITimes {
    return this.records.find((v) => v.id === id);
  }

  hasKey(key: number): boolean {
    return !!this.records.find(v => v.id === key);
  }
}

export default LRUArray;

