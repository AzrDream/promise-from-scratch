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
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }

  /**
   * Promise A+规范的then函数
   * @param {Function} onFulfilled
   * @param {Function} onRejected
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, rejected) => {

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
  throw new Error(123);
});
console.log(pro);