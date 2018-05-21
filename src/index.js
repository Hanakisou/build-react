const React = {
  createElement
}

const ReactDOM = {
  render: (vnode, container) => {
    container.innerHTML = '';
    return render(vnode, container)
  }
}

function createElement(tag, attrs, ...children){
  return {
    tag,
    attrs,
    children
  }
}

function render(vnode, container){
  if(typeof vnode === 'string'){
    const textNode = document.createTextNode( vnode ); // 创建一个新的文本节点
    return container.appendChild(textNode); 
  }
  const dom = document.createElement(vnode.tag); 
  if(vnode.attrs){
    object.keys(vnode.attrs).foreach(key => {
      const value = vnode[key];
      setAttribute(dom, key, value); // 设置指定元素上的一个属性值
    })
  }
  vnode.children.forEach(child => render(child, dom))
  return container.appendChild(dom)
}

function setAttribute(dom, name, value){
  if(name === 'className') name = 'class'
  if(/on\w+/.test(name)){
    name = name.toLowerCase();
    dom[name] = value || '';
  }else if(name === 'style'){
    if(!value || typeof name === 'string'){
      dom.style.cssText = value || '';
    } else if(value && typeof name === 'object'){
      for(let name in value){
        dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
      }
    }
  }else{
    if(name in dom){
      dom[name] = value || '';
    }
    if(value){
      dom.setAttribute(name, value)
    }else{
      dom.removeAttribute(name, value);
    }
  }
}

// function tick(){
//   const element = (
//     <div>
//       <h1>Hello, world!</h1>
//       <h2>It is {new Date().toLocaleTimeString()}</h2>
//     </div>
//   )
//   ReactDOM.render(
//     element,
//     document.getElementById('root')
//   );
// }

// setInterval( tick, 1000 );

function Welcome( props ) {
  return <h1>Hello, {props.name}</h1>;
}


// ReactDOM.render(
//   <Welcome name="world" />,
//   document.getElementById('root')
// );

// ReactDOM.render(
//   <h1>Hello, world!</h1>,
//   document.getElementById('root')
// );

const element = (
  <div className="box">
      hello<span>world!</span>
  </div>
);
// const element = <Welcome name="world" />

/*
 * 当element为组件的时候，createElement的第一个参数`tag`将会是一个方法，而不是字符串。
 * **/
console.log( element ); 