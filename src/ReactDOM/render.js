const render = (vnode, container) => {
  if(toStr(vnode) === '[object String]') {
    const textNode = document.createTextNode(vnode);
    container.appendChild(textNode);
  }
  const dom = vnode.tag && document.createElement(vnode.tag);
  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key];
      setAttribute(dom, key, value);
    })
  }
  vnode.children && vnode.children.forEach(child => render(child, dom));
  return dom && container.appendChild(dom);
}

const setAttribute = (dom, key, value) => {
  if(key === 'className') key = 'class';
  if(/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value;
  } else if (key === 'style') {
    if (!value || toStr(value) === '[object String]') {
      dom.style.cssText = value || '';
    } else if (toStr(value) === '[object Object]') {
      for (let name in value) {
        dom.style[name] = toStr(value[name]) === '[object Number]' ? value[name] + 'px' : value[name];
      }
    }
  } else {
    if (key in dom) {
      dom[key] = value|| ''
    }
    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  }
}

const toStr = Function.prototype.call.bind(Object.prototype.toString);

export default render;