import { Component } from '../React';
import { setAttribute, toStr } from './util';

export const diff = (dom, vnode, container) => {
  const ret = diffNode( dom, vnode );
  if ( container && ret.parentNode !== container ) {
    container.appendChild( ret );
  }
  return ret;
}

const diffNode = (dom, vnode) => {
  let out = dom;
  if(toStr(vnode) === '[object Null]' || toStr(vnode) === '[object Undefined]' || toStr(vnode) === '[object Boolean]') vnode = '';
  if(toStr(vnode) === '[object Number]') vnode = String(vnode);
  if(toStr(vnode) === '[object String]') {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent != vnode) {
        dom.textContent = vnode;
      }
    } else {
      out = document.createTextNode(vnode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }
    return out;
  }
  if(toStr(vnode) === '[object Array]') {
    vnode.map(v => out = diffNode(dom, v));
  }
  if(toStr(vnode.tag) === '[object Function]') {
    return diffComponent(dom, vnode);
  }
  if(!dom || !isSameNodeType(dom, vnode)) {
    out = document.createElement(vnode.tag);
    if(dom) {
      [...dom.childNodes].map(out.appendChild);
      if(dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }
  }
  if(vnode.children && vnode.children.length > 0 || out.childNodes && out.childNodes.length > 0){
    diffChildren(out, vnode.children);
  }
  diffAttributes(out, vnode);
  return out;
};

const diffComponent = (dom, vnode) => {
  let component = dom && dom._component;
  let oldDom = dom;
  if(component && component.constructor === vnode.tag) {

  } else {
    if(component) {
      unmountComponent(component);
      oldDom = null;
    }
    component = createComponent(vnode.tag, vnode.attrs);
    setComponentProps(component, vnode.attrs);
    dom = component.base;
    if(oldDom && dom !== oldDom) {
      oldDom._component = null;
      removeNode(oldDom);
    }
  }
  return dom;
}

const diffChildren = (dom, vchildren) => {
  const domChildren = dom.childNodes;
  const children = [];
  if(domChildren.length > 0) {
    for(let i=0;i<domChildren.length;i++) {
      const child = domChildren[i];
      children.push(child);
    }
  }
  if (vchildren && vchildren.length > 0) {
    let min = 0;
    let childrenLen = children.length;
    for(let i=0;i<vchildren.length;i++){
      const vchild = vchildren[i] || '';
      let child;
      if(min < childrenLen) {
        for ( let j = min; j < childrenLen; j++ ) {
          let c = children[j];
          if ( c && isSameNodeType(c, vchild) ) {
            child = c;
            children[j] = undefined;
            if ( j === childrenLen - 1 ) childrenLen--;
            if ( j === min ) min++;
            break;
          }
        }
      }
      child = diffNode(child, vchild);
      const f = domChildren[i];
      if(child && child !== dom && child !== f){
        if(!f) {
          // 当前节点不存在直接新增
          dom.appendChild(child);
        } else if (child === f.nextSbing) {
          // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
          removeNode(f);
        } else {
          // 将更新后的节点移动到正确的位置
          dom.insertBefore(child, f);
        }
      }
    }
    for(let i=vchildren.length;i<domChildren.length;i++){
      const f = domChildren[i];
      removeNode(f);
    }
  }
}

const diffAttributes = (dom, vnode) => {
  const old = {};
  const attrs = vnode.attrs;
  for (let i = 0; i < dom.attributes.length; i++) {
    const attr = dom.attributes[i];
    old[attr.name] = attr.value;
  }
  for(let name in old) {
    if(!(name in attrs)){
      setAttribute(dom, name, undefined);
    }
  }
  for(let name in attrs) {
    if(old[name] !== attrs[name]) {
      setAttribute(dom, name, attrs[name]);
    }
  }
}

const isSameNodeType = (dom, vnode) => {
  if(toStr(vnode) === '[object String]' || toStr(vnode) === '[object Number]') {
    return dom && dom.nodeType === 3;
  }
  if(toStr(vnode.tag) === '[object String]') {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
  }
  return dom && dom._component && dom._component.constructor === vnode.tag;
}

const createComponent = (component, props) => {
  let inst;
  if(component.prototype && component.prototype.render) {
    inst = new component(props);
  } else {
    inst = new Component(props);
    inst.constructor = component;
    inst.render = function() {
      return this.constructor(props);
    };
  }
  return inst;
}

const setComponentProps = (component, props) => {
  if (!component.base) {
    component.componentWillMount && component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }
  component.props = props;

  renderComponent( component );
}

export const renderComponent = (component) => {
  let base;
  const renderer = component.render();

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }
  
  // console.log(renderer);
  base = diffNode(component.base, renderer);

  component.base = base;
  base._component = component;

  if(component.base) {
    component.componentDidUpdate && component.componentDidUpdate();
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }

  component.base = base;
  base._component = component;
}

const unmountComponent = (component) => {
  if (component.componentWillUnmount) component.componentWillUnmount();
  removeNode( component.base);
}

const removeNode = (dom) => {
  if(dom && dom.parentNode) {
    dom.parentNode.removeChild(dom);
  }
}