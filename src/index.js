import React from './React';
import ReactDOM from './ReactDOM';

// 渲染dom节点
// const element = (
//   <div className="d_v" onClick={() => {console.log(111)}}>
//     11<span style={{color: 'red', fontSize: 20}}>world!</span>
//   </div>
// );

// 渲染方法
// function Welcome( props ) {
//   return <h1>Hello, {props.name}</h1>;
// }

// const element = <Welcome name='world' />;

// ReactDOM.render(
//   element,
//   document.getElementById('root')
// );

// 渲染Class类
class Welcome extends React.Component {
  render() {
      return <h1>Hello, {this.props.name}</h1>;
  }
} 

class App extends React.Component {
  render() {
    return (
      <div>
        <Welcome name="1" />
        <Welcome name="2" />
        <Welcome name="3" />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


// function a() {
//   const element = (
//     <div>
//         <h1>Hello, world!</h1>
//         <h2>It is {new Date().toLocaleTimeString()}.</h2>
//     </div>
//   );
//   ReactDOM.render(
//       element,
//       document.getElementById( 'root' )
//   );
// }
// setInterval(a, 1000);

// console.log('~~', element);