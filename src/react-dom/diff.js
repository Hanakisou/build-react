import { Componet } from '../react'
import { setAttribute } from './dom'

/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} vnode 虚拟DOM
 * @param {HTMLElement} container 容器
 * @return {HTMLElement} 更新后的真实DOM
 */  
export function diff(dom, vnode, container){
  const ret = diffNode( dom, vnode );
  if ( container && ret.parentNode !== container ) {
    container.appendChild( ret );
  }
  return ret;
}

function diffNode( dom, vnode ) {
  let out = dom;
  if(vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
  if(typeof vnode === 'number') vnode = String(vnode);
  // diff text node
  if(typeof vnode === 'string'){
    // 如果当前的DOM就是文本节点，则直接更新内容
    if(dom && dom.nodeType === 3){
      if(dom.textContent !== vnode){
        dom.textContent = vnode
      }
    }else{ // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
      out = document.createTextNode(vnode);
      if(dom && dom.parentNode){
        dom.parentNode.replaceChild(out, dom);
      }
    }
    return out;
  }
  if(typeof vnode.tag === 'function'){
    return diffComponent( dom, vnode );
  }
  if(!dom || !isSameNodeType(dom, vnode)){
    out = document.createElement(vnode.tag);
    if(dom){
      [...dom.childNodes].map(out.appendChild)
      if(dom.parentNode){
        dom.parentNode.replaceChild(out, dom);
      }
    }
  }
  if(vnode.children && vnode.children.length > 0 || out.childNodes && out.childNodes.length > 0){
    diffChildren( out, vnode.children );
  }
  diffAttributes( out, vnode );
  return out
}

function isSameNodeType(dom, vnode){
  if(typeof vnode === 'number' || typeof vnode === 'string'){
    return dom.nodeType === 3;
  }
  if(typeof vnode.tag === 'string'){
    return vnode.tag.toLowerCase() === dom.nodeName.toLowerCase();
  }
  return dom && dom._component && dom._component.constructor === vnode.tag;
}

function diffAttributes(dom, vnode){
  const old = {};    // 当前DOM的属性
  const attrs = vnode.attrs;     // 虚拟DOM的属性
  for(let i=0;i<dom.attributes.length;i++){
    const attr = dom.attributes[i];
    old[attr.name] =  attr.value;
  }
  // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）
  // for(let name of old){
  //   if(attrs.indexOf(name) !== -1){
  //     setAttribute( dom, name, undefined );
  //   }
  // }
  for ( let name in old ) {
    if ( !( name in attrs ) ) {
      setAttribute( dom, name, undefined );
    }
  }
  for(let name in attrs){
    if(old[name] !== attrs[name]){
      setAttribute(dom, name, attrs[name]);
    }
  }
}

function diffChildren(dom, vchildren){
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};

  if(domChildren.length > 0){
    for(let i=0;i<domChildren.length;i++){
      const child = domChildren[i];
      const key = child.key;
      if(key){
        keyedLen++;
        keyed[key] = child;
      }else{
        children.push(child);
      }
    }
  }

  if(vchildren && vchildren.length > 0){
    let min = 0;
    let childrenLen = children.length;
    for(let i=0;i<vchildren.length;i++){
      const vchild = vchildren[ i ];
      const key = vchild.key;
      let child;
      if(key){
        if(keyed[key]){
          child = keyed[key];
          keyed[key] = undefined;
        }
      }else if(min < childrenLen){
        for(let j=min;j<childrenLen;i++){
          let c = children[j];
          if(c && isSameNodeType(c, vchild)){
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
      if ( child && child !== dom && child !== f ) {
				if ( !f ) {
					dom.appendChild(child);
				} else if ( child === f.nextSibling ) {
					removeNode( f );
				} else {
					dom.insertBefore( child, f );
				}
			}
    }
  }
}

function diffComponent(dom, vnode){
  let c = dom && dom._component;
  let oldDom = dom;
  // 如果组件类型没有变化，则重新set props
  if(c && c.constructor === vnode.tag){
    setComponentProps(c, vnode.attrs);
    dom = c.base;
  }else{ // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
    if(c){
      unmountComponent(c);
      oldDom = null;
    }
    c = createComponent(vnode.tag, vnode.attrs);
    setComponentProps(c, vnode.attrs);
    dom = c.base;
    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      removeNode( oldDom );
    }
  }
  return dom;
}

function unmountComponent( component ) {
  if ( component.componentWillUnmount ) component.componentWillUnmount();
  removeNode( component.base);
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

export function renderComponent(component){
  let base;
  const renderer = component.render();
  if(component.base && component.componentWillMount){
    component.componentWillUpdate();
  }
  base = diffNode( component.base, renderer );
  component.base = base;
  base._component = component;
  // base = _render( renderer );
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

function removeNode( dom ) {
  if ( dom && dom.parentNode ) {
    dom.parentNode.removeChild( dom );
  }
}