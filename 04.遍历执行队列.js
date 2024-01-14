const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

/**
 * 运行一个微队列任务
 * 把传递的函数放到微队列当中
 * @param {Function} callback
 */
function runMicroTask(callback) {
  // 判断node环境
  if (process && process.nextTick) {
    process.nextTick(callback);
  } else if (MutationObserver) {
    const p = document.createElement('p');
    const observer = new MutationObserver(callback);
    observer.observe(p, {
      childList: true
    });
    p.innerHTML = '1';
  } else {
    setTimeout(callback, 0);
  }
}

class MyPromise {
  /**
   *创建一个promise
   * @param executor 任务执行器，立即执行
   */
  constructor(executor) {
    this._state = PENDING; // 状态
    this._value = undefined; // 数据
    this._handlers = []; // 处理函数形成的队列
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }

  /**
   * 向处理队列中添加一个函数
   * @param {Function} executor 添加的函数
   * @param {String} state 该函数什么状态下执行
   * @param {Function} resolve 让then函数返回的Promise成功
   * @param {Function} reject 让then函数返回的Promise失败
   * @private
   */
  _pushHandler(executor, state, resolve, reject) {
    this._handlers.push({
      executor,
      state,
      resolve,
      reject
    })
  }

  /**
   * 根据实际情况，执行队列
   * @private
   */
  _runHandlers() {
    if (this._state === PENDING) {
      // 目前任务仍在挂起
      return;
    }
    while (this._handlers[0]) {
      const handler = this._handlers[0];
      this._runOneHandler(handler);
      this._handlers.shift();
    }
  }

  /**
   * 处理一个handler
   * @param {Object} handler
   * @private
   */
  _runOneHandler(handler) {

  }

  /**
   * Promise A+规范的then函数
   * @param {Function} onFulfilled
   * @param {Function} onRejected
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, rejected) => {
      this._pushHandler(onFulfilled, FULFILLED, resolve, rejected);
      this._pushHandler(onRejected, REJECTED, resolve, rejected);
      this._runHandlers();  // 执行队列
    });
  }

  /**
   * 更改任务状态
   * @param {String} newState 新状态
   * @param {*} value 相关数据
   */
  _changeState(newState, value) {
    if (this._state !== PENDING) {
      // 目前状态已经更改
      return;
    }
    this._state = newState;
    this._value = value;
    this._runHandlers();  // 状态变化，执行队列
  }

  /**
   * 标记当前任务完成
   * @private
   * @param {any} data 任务完成的相关数据
   */
  _resolve(data){
    this._changeState(FULFILLED, data);
  }

  /**
   * 标记当前任务失败
   * @private
   * @param {any} reason 任务失败的相关数据
   */
  _reject(reason){
    this._changeState(REJECTED, reason);
  }
}
let pro = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
    console.log(pro);
  }, 1000);
});
pro.then(function A1(){}, function A2() {});
pro.then(function B1(){}, function B2() {});