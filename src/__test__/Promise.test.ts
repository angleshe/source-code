import assert from 'power-assert';

const TestPromise = Promise;

describe('src/Promise', () => {
  it('成功', () =>
    new TestPromise<string>((resolve, reject) => {
      resolve('成功');
      reject('失败');
    }).then((value) => assert.strictEqual(value, '成功')));

  it('失败', () => {
    new TestPromise<string>((resolve, reject) => {
      reject('失败');
      resolve('成功');
    }).then(undefined, (err) => assert.strictEqual(err, '失败'));
    new TestPromise<string>((resolve, reject) => {
      reject('失败');
      resolve('成功');
    }).catch((err) => assert.strictEqual(err, '失败'));
    new TestPromise<string>(() => {
      throw '报错';
    }).catch((err) => assert.strictEqual(err, '报错'));
  });

  it('异步', () => {
    const testArr: number[] = [];
    testArr.push(1);
    new TestPromise<void>((resolve) => {
      testArr.push(2);
      resolve();
    }).then(() => {
      testArr.push(3);
      assert.deepStrictEqual(testArr, [1, 2, 4, 6, 3]);
    });
    new TestPromise<void>((resolve, reject) => {
      testArr.push(4);
      reject();
    }).then(undefined, () => {
      testArr.push(5);
      assert.deepStrictEqual(testArr, [1, 2, 4, 6, 3, 5]);
    });
    testArr.push(6);
    assert.deepStrictEqual(testArr, [1, 2, 4, 6]);

    new TestPromise<string>((resolve) => {
      setTimeout(() => {
        resolve('异步');
      });
    }).then((value) => assert.strictEqual(value, '异步'));
    new TestPromise<string>((resolve, reject) => {
      setTimeout(() => {
        reject('异步错误');
      });
    }).catch((value) => assert.strictEqual(value, '异步错误'));
  });

  it('then 多次调用', () => {
    const promise = new TestPromise<string>((resolve) => {
      setTimeout(() => {
        resolve('promise');
      }, 500);
    });

    promise.then((value) => assert.strictEqual(value, 'promise'));
    promise.then((value) => assert.strictEqual(value, 'promise'));
    promise.then((value) => assert.strictEqual(value, 'promise'));
    promise.then((value) => assert.strictEqual(value, 'promise'));
    promise.then((value) => assert.strictEqual(value, 'promise'));
  });

  // it('Promises/A+ 2.2.7: then 方法必须返回一个 promise 对象', () => {
  //   const promise = new TestPromise<void>((resolve) => {
  //     resolve();
  //   }).then();
  //   assert.ok(promise instanceof TestPromise);
  // });

  // it('Promises/A+ 2.2.7.1: onFulfilled/onRejected返回一个值', () => {
  //   new TestPromise<void>((resolve) => {
  //     resolve();
  //   })
  //     .then<string>(() => 'promise')
  //     .then((value) => assert.strictEqual(value, 'promise'));

  //   new TestPromise<void>((resolve, reject) => {
  //     reject();
  //   })
  //     .then<never, string>(undefined, () => 'promise')
  //     .then(undefined, (value) => assert.strictEqual(value, 'promise'));
  // });

  // it('Promises/A+ 2.2.7.2: onFulfilled/onRejected抛出一个异常', () => {
  //   new TestPromise<void>((resolve) => {
  //     resolve();
  //   })
  //     .then(() => {
  //       throw 'error';
  //     })
  //     .then(undefined, (value) => assert.strictEqual(value, 'promise'));

  //   new TestPromise<void>((resolve) => {
  //     resolve();
  //   })
  //     .then(undefined, () => {
  //       throw 'error';
  //     })
  //     .then(undefined, (value) => assert.strictEqual(value, 'promise'));
  // });
});
