/**
 * @description 两数之和,时间复杂度O(n)
 *
 * @param {Array<number>} nums
 * @param {number} target
 * @returns {Array<number>}
 */
function twoSumByHash(nums: Array<number>, target: number): Array<number> {
  const hashMap: Record<string, number> = {};
  for (let i = 0, len = nums.length; i < len; i++) {
    if (target - nums[i] in hashMap) {
      return [hashMap[target - nums[i]], i];
    }
    hashMap[nums[i]] = i;
  }
  return [];
}

/**
 * @description 两数之和,时间复杂度O(n^2)
 *
 * @param {Array<number>} nums
 * @param {number} target
 * @returns {Array<number>}
 */
function twoNumByLoop(nums: Array<number>, target: number): Array<number> {
  for (let i = 0, len = nums.length; i < len; i++) {
   for (let j = i + 1; j < len; j++) {
     if (nums[i] + nums[j] === target) {
       return [i, j];
     }
   }
  }
  return []
}
console.time('loop');
console.log(twoNumByLoop([2, 6, 9, 23], 29));
console.timeEnd('loop');
console.log('\r---------------------\r');
console.time('hash');
console.log(twoSumByHash([2, 6, 9, 23], 29));
console.timeEnd('hash');


