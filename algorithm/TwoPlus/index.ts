/**
 *
 * 两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
 * 请你将两个数相加，并以相同形式返回一个表示和的链表。
 */
/**
 * @description 循环处理。时间复杂度O(2n)
 *
 * @param {Array<number>} linklist1
 * @param {Array<number>} linklist2
 * @returns {Array<number>}
 */
function twoPlusByLoop(
  linklist1: Array<number>,
  linklist2: Array<number>
): Array<number> {
  const result = [];
  let carry = 0;
  for (let i = 0; i < linklist1.length; i++) {
    if (linklist2.length === 0) {
      if (linklist1[i] + carry >= 10) {
        result.push((linklist1[i] + carry) % 10);
        carry = 1;
      } else {
        result.push(linklist1[i] + carry);
        carry = 0;
      }
    }
    for (let j = 0; j < linklist2.length; j++) {
      const sum = linklist1[i] + linklist2[j];
      if (sum >= 10) {
        result.push((sum % 10) + carry);
        carry = 1;
      } else {
        console.log(sum, carry);
        result.push(sum + carry);
        carry = 0;
      }
      linklist2.shift();
      break;
    }
  }
  if (carry) {
    result.push(carry);
  }
  return result;
}

// 每个链表中的节点数在范围 [1, 100] 内
// 0 <= Node.val <= 9
// 题目数据保证列表表示的数字不含前导零

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
// function ListNode(val?: any, next?: any): any {
//   this.val = val === undefined ? 0 : val;
//   this.next = next === undefined ? null : next;
// }
class ListNode {
  val: any;
  next: any;
  constructor(val?: any, next?: any) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}
const linklist1 = [2, 4, 3].reduce((linklist, current, index, origin) => {
  if (index + 1 <= origin.length) {
    linklist.val = current;
    linklist.next = new ListNode(origin[index + 1]);
    // const dom = { val: current, next: new ListNode(origin[index+ 1])};
  } else {
    linklist.val = current;
    linklist.next = null;
  }

  return linklist;
}, new ListNode());
const linklist2 = [5, 6, 4].reduce((linklist, current, index, origin) => {
  if (index + 1 <= origin.length) {
    linklist.val = current;
    linklist.next = new ListNode(origin[index + 1]);
    // const dom = { val: current, next: new ListNode(origin[index+ 1])};
  }

  return linklist;
}, new ListNode());
function twoPlusByLinklist(l1?: any, l2?: any) {
  let head = new ListNode();
  let current = head;
  let temp: any = 0;
  while (l1 != null || l2 != null) {
    let x = l1 != null ? l1.val : 0;
    let y = l2 != null ? l2.val : 0;
    let sum = x + y + temp;
    temp = parseInt(String(sum / 10));
    current.next = new ListNode(parseInt(String(sum % 10)));
    current = current.next;
    if (l1 != null) l1 = l1.next;
    if (l2 != null) l2 = l2.next;
  }
  if (temp > 0) {
    current.next = new ListNode(temp);
  }
  return head.next;
}

// console.log(twoPlusByLoop([9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]));
console.log(linklist1);
console.log(linklist2);
console.log(twoPlusByLinklist(linklist1, linklist2));


// https://leetcode-cn.com/problems/reverse-linked-list/
// https://leetcode-cn.com/problems/swap-nodes-in-pairs/
// https://leetcode-cn.com/problems/linked-list-cycle/
// https://leetcode-cn.com/problems/linked-list-cycle-ii/