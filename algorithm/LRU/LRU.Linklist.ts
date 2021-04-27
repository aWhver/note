interface INodeMap<T> {
  key: string | null;
  value: T | null;
  prevNode: INodeMap<T> | null;
  nextNode: INodeMap<T> | null;
}
/**
 * @description 缓存淘汰策略
 * @date 2021-03-26
 * @class LRU
 */
class LRUCache<T> {
  protected limit: number;
  LinkedListNodeMap: Record<string, INodeMap<T>> = {};
  protected head: INodeMap<T>;
  protected tail: INodeMap<T>;
  size: number;
  constructor(limit: number) {
    this.limit = limit;
    this.init();
  }

  protected init() {
    this.head = this.createLinkedListNode(null, null);
    this.tail = this.createLinkedListNode(null, null);
    this.head.nextNode = this.tail;
    this.tail.prevNode = this.head;
  }

  protected createLinkedListNode(key: string, value: T | null): INodeMap<T> {
    return {
      key,
      value,
      prevNode: null,
      nextNode: null,
    }
  }

  get(key: number): T | null {
    if (this.LinkedListNodeMap[key]) {
      const visitedNode = this.LinkedListNodeMap[key];
      visitedNode.nextNode = this.head.nextNode;
      visitedNode.prevNode = this.head;
      this.tail.prevNode = visitedNode;
      this.head = visitedNode;
      return visitedNode.value;
    }
    return null;
  }

  put(key: string, value: T) {
    if (this.LinkedListNodeMap[key]) {
      this.LinkedListNodeMap[key].value = value;
      const visitedNode = this.LinkedListNodeMap[key];
      this.LinkedListNodeMap[key] = visitedNode;
      visitedNode.nextNode = this.head.nextNode;
      visitedNode.prevNode = this.head;
      this.tail.prevNode = visitedNode;
      this.head = visitedNode;
    } else {
      this.size++;
      if (this.size > this.limit) {
        this.size--;
        const _head = this.createLinkedListNode(key, value);
        this.LinkedListNodeMap[key] = _head;
        _head.nextNode = this.head.nextNode;
        _head.prevNode = this.head;
        this.head = _head;
        this.tail = this.tail.prevNode;
        delete this.LinkedListNodeMap[this.tail.key];
      } else {
        const _head = this.createLinkedListNode(key, value);
        this.LinkedListNodeMap[key] = _head;
        _head.nextNode = this.head.nextNode;
        _head.prevNode = this.head;
        this.head = _head;
        this.tail = this.tail.prevNode;
      }
    }
    // if ()
  }

}

export default LRUCache;

