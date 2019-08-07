import Component from '../React/Component';
import {
  setAttribute,
  toStr,
} from './util';

const _render = (vnode) => {
  if(toStr(vnode) === '[object Null]' || toStr(vnode) === '[object Undefined]' || toStr(vnode) === '[object Boolean]') vnode = '';
  if(toStr(vnode) === '[object Number]') vnode = String(vnode);
  if(toStr(vnode) === '[object String]') {
    const textNode = document.createTextNode(vnode);
    return textNode;
  }
  if(toStr(vnode.tag) === '[object Function]') {
    const component = createComponent(vnode.tag, vnode.attrs);
    renderComponent(component)
    return component.base;
  }
  const dom = vnode.tag && document.createElement(vnode.tag);
  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key];
      setAttribute(dom, key, value);
    })
  }
  vnode.children && vnode.children.forEach(child => render(child, dom));
  return dom;
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

export const renderComponent = (component) => {
  let base;
  const renderer = component.render();
  
  console.log(renderer);
  base = _render( renderer );
  component.base = base;
}

const render = (vnode, container) => {
  return container.appendChild(_render(vnode));
}

export default render;