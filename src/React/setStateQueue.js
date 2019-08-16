import { renderComponent } from '../ReactDOM/diff';
import { toStr } from '../ReactDOM/util';

const sQueue = [];
const cQueue = [];

export const enqueueSetState = (stateChange, component) => {
  if(sQueue.length === 0) {
    defer( flush );
  }
  sQueue.push({
    stateChange,
    component,
  })
  // 如果renderQueue里没有当前组件，则添加到队列中
  if(!cQueue.some(v => v === component)) {
    cQueue.push(component);
  }
}

const flush = () => {
  let item, component;
  while(item = sQueue.shift()) {
    const { stateChange, component } = item;
    if(!component.prevState) {
      component.prevState = Object.assign({}, stateChange);
    }
    if(toStr(stateChange) === '[object Function]') {
      Object.assign( component.state, stateChange( component.prevState, component.props ) );
    } else {
      Object.assign( component.state, stateChange );
    }
  }
  // 渲染每一个组件
  while( component = cQueue.shift() ) {
    renderComponent( component );
  }
}

const defer = (fn) => {
  return Promise.resolve().then( fn );
}