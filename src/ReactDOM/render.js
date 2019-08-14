// import Component from '../React/Component';
// import {
//   setAttribute,
//   toStr,
// } from './util';
import { diff } from './diff';

// const _render = (vnode) => {
//   if(toStr(vnode) === '[object Null]' || toStr(vnode) === '[object Undefined]' || toStr(vnode) === '[object Boolean]') vnode = '';
//   if(toStr(vnode) === '[object Number]') vnode = String(vnode);
//   if(toStr(vnode) === '[object String]') {
//     const textNode = document.createTextNode(vnode);
//     return textNode;
//   }
//   if(toStr(vnode.tag) === '[object Function]') {
//     const component = createComponent(vnode.tag, vnode.attrs);
//     setComponentProps(component, vnode.attrs);
//     return component.base;
//   }
//   const dom = vnode.tag && document.createElement(vnode.tag);
//   if (vnode.attrs) {
//     Object.keys(vnode.attrs).forEach(key => {
//       const value = vnode.attrs[key];
//       setAttribute(dom, key, value);
//     })
//   }
//   vnode.children && vnode.children.forEach(child => render(child, dom));
//   return dom;
// }

// const createComponent = (component, props) => {
//   let inst;
//   if(component.prototype && component.prototype.render) {
//     inst = new component(props);
//   } else {
//     inst = new Component(props);
//     inst.constructor = component;
//     inst.render = function() {
//       return this.constructor(props);
//     };
//   }
//   return inst;
// }

// const setComponentProps = (component, props) => {
//   if (!component.base) {
//     component.componentWillMount && component.componentWillMount();
//   } else if (component.componentWillReceiveProps) {
//     component.componentWillReceiveProps(props);
//   }
//   component.props = props;

//   renderComponent( component );
// }

// export const renderComponent = (component) => {
//   let base;
//   const renderer = component.render();

//   if (component.base && component.componentWillUpdate) {
//     component.componentWillUpdate();
//   }
  
//   // console.log(renderer);
//   base = _render( renderer );

//   if(component.base) {
//     component.componentDidUpdate && component.componentDidUpdate();
//   } else if (component.componentDidMount) {
//     component.componentDidMount();
//   }

//   // 新节点替换旧节点
//   if ( component.base && component.base.parentNode ) {
//     component.base.parentNode.replaceChild( base, component.base );
//   }

//   component.base = base;
//   base._component = component;
// }

const render = (vnode, container, dom) => {
  // return container.appendChild(_render(vnode));
  diff(dom, vnode, container);
}

export default render;