import { DefaultRecord } from '../typings';
/**
 * @description  获取对象属性值
 * @date 2021-03-25
 * @return any
*/
export const get = function (obj: DefaultRecord, keyPath: string) {
  const reg = /\[(\w+|\d+)\]/g;
  const newKeyPath = keyPath.replace(reg, '.$1');
  const paths = newKeyPath.split('.');
  let result: any = obj;
  while(paths.length){
    var p = paths.shift();
    result = Object(result)[p];
    if (result === undefined) {
      return undefined;
    }
  }
  return result
};

export default 4;
