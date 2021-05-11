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
  size: number = 0;
  constructor(limit: number) {
    this.limit = limit;
    this.init();
  }

  protected init() {
    this.head = null; // this.createLinkedListNode(null, null);
    this.tail = null; // this.createLinkedListNode(null, null);
    // this.head.nextNode = this.tail;
    // this.tail.prevNode = this.head;
  }

  protected createLinkedListNode(key: string, value: T | null): INodeMap<T> {
    return {
      key,
      value,
      prevNode: null,
      nextNode: null,
    };
  }

  get(key: string): T | null {
    if (this.LinkedListNodeMap[key]) {
      const { value } = this.LinkedListNodeMap[key];
      const node = this.createLinkedListNode(key, value);
      this.remove(key);
      this.setHead(node);
      return value;
    }
    return null;
  }

  put(key: string, value: T) {
    const node = this.createLinkedListNode(key, value);
    // console.log(node, this.head);
    if (this.LinkedListNodeMap[key]) {
      this.LinkedListNodeMap[key].value = value;
      this.remove(key);
    } else if (this.size >= this.limit) {
      delete this.LinkedListNodeMap[this.tail.key];
      this.tail = this.tail.prevNode;
      if (this.tail) {
        this.tail.nextNode = null;
      }
      this.size--;
      // this.tail.prevNode =
    }
    this.setHead(node);
  }

  remove(key: string) {
    const node = this.LinkedListNodeMap[key];
    const { nextNode, prevNode } = node;
    delete node.nextNode;
    delete node.prevNode;
    // console.log(this.LinkedListNodeMap, node);
    if (node === this.head) {
      this.head = nextNode;
    }
    if (node === this.tail) {
      this.tail = prevNode;
    }
    if (prevNode) {
      node.prevNode.nextNode = nextNode;
    }
    if (nextNode) {
      node.nextNode.prevNode = prevNode;
    }
    delete this.LinkedListNodeMap[key];
    this.size--;
  }

  setHead(node: INodeMap<T>) {
    node.nextNode = this.head;
    node.prevNode = null;
    if (this.head) {
      this.head.prevNode = node;
    }
    this.head = node;

    if (this.tail === null) {
      this.tail = node;
    }
    this.size++;
    this.LinkedListNodeMap[node.key] = node;
  }
  getSize() {
    return this.size;
  }
}

export default LRUCache;
