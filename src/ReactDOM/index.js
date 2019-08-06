import render from './render';

const ReactDom = {
  render: (vnode, container) => {
    container.innerHTML = '';
    return render(vnode, container);
  }
}

export default ReactDom;
