const foo = [];
const bar = () => {
  console.log('bar');
}
foo.push({ bar });
const foofoo = foo.shift();
// foofoo.map(f => f());
console.log('done');