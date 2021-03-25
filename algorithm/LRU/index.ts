import { get } from '../../utils/lodash-simple';

const result =  get(
  {
    a: {
      b: [3, 5,6],
    },
  },
  'a[b][0]'
);
console.log(result);