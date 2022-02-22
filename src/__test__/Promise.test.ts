import assert from 'power-assert';

const TestPromise = Promise;

type TestPromiseType<T> = Promise<T>;

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

  it('Promises/A+ 2.2.7: then 方法必须返回一个 promise 对象', () => {
    const promise = new TestPromise<void>((resolve) => {
      resolve();
    }).then();
    assert.ok(promise instanceof TestPromise);
  });

  it('Promises/A+ 2.2.7.1: onFulfilled/onRejected返回一个值', () => {
    new TestPromise<void>((resolve) => {
      resolve();
    })
      .then<string>(() => 'promise')
      .then((value) => assert.strictEqual(value, 'promise'));

    new TestPromise<void>((resolve, reject) => {
      reject();
    })
      .then<never, string>(undefined, () => 'promise')
      .then(undefined, (value) => assert.strictEqual(value, 'promise'));
  });

  it('Promises/A+ 2.2.7.2: onFulfilled/onRejected抛出一个异常', () => {
    new TestPromise<void>((resolve) => {
      resolve();
    })
      .then(() => {
        throw 'error';
      })
      .then(undefined, (value) => assert.strictEqual(value, 'error'));

    new TestPromise<void>((resolve, reject) => {
      reject();
    })
      .then(undefined, () => {
        throw 'error';
      })
      .then(undefined, (value) => assert.strictEqual(value, 'error'));
  });

  it('Promises/A+ 2.2.7.3: onFulfilled 不是函数且 promise1 成功执行', () => {
    new TestPromise<string>((resolve) => {
      resolve('成功');
    })
      .then()
      .then((s) => assert.strictEqual(s, '成功'));
  });

  it('Promises/A+ 2.2.7.4: onRejected 不是函数且 promise1 拒绝执行', () => {
    new TestPromise<void>(() => {
      throw 'error';
    })
      .then()
      .then(undefined, (value) => assert.strictEqual(value, 'error'));

    new TestPromise<void>((resolve, reject) => {
      reject('error');
    })
      .then()
      .then(undefined, (value) => assert.strictEqual(value, 'error'));
  });
  // 2.3
  it('Promises/A+ 2.3.1: x 与 promise 相等', () => {
    const promise = new TestPromise((resolve) => {
      resolve(promise);
    })
      .then(() => assert.ok(false))
      .catch(() => assert.ok(true));
  });
  it('Promises/A+ 2.3.1: x 为 Promise', () => {
    new TestPromise<TestPromiseType<string>>((resolve) => {
      resolve(
        new TestPromise<string>((res) => setTimeout(() => res('成功'), 200))
      );
    }).then((s) => assert.strictEqual(s, '成功'));

    const successPromise = new TestPromise<string>((resolve) => resolve('成功'));
    new TestPromise<TestPromiseType<string>>((resolve) => {
      resolve(successPromise);
    }).then((s) => assert.strictEqual(s, '成功'));

    const errorPromise = new TestPromise<void>((resolve, reject) => reject('error'));
    new TestPromise<TestPromiseType<void>>((resolve) => resolve(errorPromise)).then(
      undefined,
      (err) => assert.strictEqual(err, 'error')
    );
  });
  it('Promises/A+ 2.3.3: x 为对象或函数', () => {
    type LikePromiseType<T> = {
      then: (...args: Parameters<TestPromiseType<T>['then']>) => void;
    };
    // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
    new TestPromise<() => void>((resolve) => resolve(() => void 0)).then(undefined, () =>
      assert.ok(true)
    );

    // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
    const likeSuccessPromiseObj1: LikePromiseType<string> = {
      then(resolvePromise) {
        resolvePromise?.('likeSuccessPromiseObj1: success');
      }
    };

    new TestPromise<LikePromiseType<string>>((resolve) =>
      resolve(likeSuccessPromiseObj1)
    ).then((s) => assert.strictEqual(s, 'likeSuccessPromiseObj1: success'));

    // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
    const likeErrorPromiseObj1: LikePromiseType<void> = {
      then(resolvePromise, rejectPromise) {
        rejectPromise?.('likeErrorPromiseObj1: error');
      }
    };
    new TestPromise<LikePromiseType<void>>((resolve) =>
      resolve(likeErrorPromiseObj1)
    ).then(undefined, (err) => assert.strictEqual(err, 'likeErrorPromiseObj1: error'));

    // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
    const likeSuccessPromiseObj2: LikePromiseType<string> = {
      then(resolvePromise, rejectPromise) {
        resolvePromise?.('likeSuccessPromiseObj2: success');
        resolvePromise?.('success');
        rejectPromise?.('likeSuccessPromiseObj2: error');
        rejectPromise?.('error');
      }
    };

    new TestPromise<LikePromiseType<string>>((resolve) =>
      resolve(likeSuccessPromiseObj2)
    ).then((s) => assert.strictEqual(s, 'likeSuccessPromiseObj2: success'));

    // 2.3.3.3.4 如果调用 then 方法抛出了异常 e：
    // 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
    const likeErrorPromiseObj2: LikePromiseType<string> = {
      then(resolvePromise, rejectPromise) {
        rejectPromise?.('likeErrorPromiseObj2: error');
        rejectPromise?.('error');
        resolvePromise?.('likeErrorPromiseObj2: success');
        resolvePromise?.('success');
        throw 'likeErrorPromiseObj2 throw error';
      }
    };

    new TestPromise<LikePromiseType<string>>((resolve) =>
      resolve(likeErrorPromiseObj2)
    ).then(undefined, (s) => assert.strictEqual(s, 'likeErrorPromiseObj2: error'));

    // 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
    const likeErrorPromiseObj3: LikePromiseType<void> = {
      then() {
        throw 'likeErrorPromiseObj3: error';
      }
    };

    new TestPromise<LikePromiseType<void>>((resolve) =>
      resolve(likeErrorPromiseObj3)
    ).then(undefined, (err) => assert.strictEqual(err, 'likeErrorPromiseObj3: error'));

    // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
    const testObj = {
      then: 'test obj success'
    };
    new TestPromise<typeof testObj>((resolve) => resolve(testObj)).then((s) =>
      assert.strictEqual(s, testObj)
    );
  });

  it('Promises/A+2.3.4: x  不为对象或函数', () => {
    new TestPromise<boolean>((resolve) => resolve(false)).then((s) => assert.ok(!s));
  });
});
