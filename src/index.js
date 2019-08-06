import React from './React';
import ReactDOM from './ReactDOM';

const element = (
  <div className="d_v" onClick={() => {console.log(111)}}>
    hello<span style={{color: 'red', fontSize: 20}}>world!</span>
  </div>
);

ReactDOM.render(
  element,
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