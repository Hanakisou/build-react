import { Componet } from '../react';
import { setAttribute } from './dom';

export function render(vnode, container){
  container.appendChild(_render(vnode));
}

function _render(vnode){
  if(vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
  if(typeof vnode === 'number') vnode = String(vnode);
  if(typeof vnode === 'string'){
    const textNode = document.createTextNode(vnode);
    return textNode;
  }
  if(typeof vnode.tag === 'function'){
    const component = createComponent(vnode.tag, vnode.attrs);
    setComponentProps(component, vnode.attrs);
    return component.base;
  }
  const dom = document.createElement( vnode.tag );
  if(vnode.attrs){
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key];
      setAttribute(dom, key, value)
    })
  }
  vnode.children.forEach(child => render(child, dom));
  return dom;
}

function createComponent(component, props){
  let inst;
  if(component.prototype && component.prototype.render){ // 如果是类定义组件，则直接返回实例
    inst = new component( props );
  }else{ // 如果是函数定义组件，则将其扩展为类定义组件
    inst = new component( props );
    inst.constructor = component;
    inst.render = function() {
      return this.constructor( props );
    }
  }
  return inst;
}

function setComponentProps(component, props){
  if(!component.base){
    if(component.componentWillMount) component.componentWillMount();
  }else if(component.componentWillReceiveProps){
    component.componentWillReceiveProps();
  }
  component.props = props;
  renderComponent(component);
}

export function renderComponent(component){
  let base;
  const renderer = component.render();
  if(component.base && component.componentWillMount){
    component.componentWillUpdate();
  }
  base = _render( renderer );
  if(component.base){
    if(component.componentDidUpdate) component.componentDidUpdate(); 
  }else if(component.componentDidMount){
    component.componentDidMount();
  }
  if(component.base && component.base.parentNode){
    component.base.parentNode.replaceChild( base, component.base );
  }
  component.base = base;   // component的base在这里赋值
  base._component = component;
}