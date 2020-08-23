import { h, render } from 'preact';
import { useState } from 'preact/hooks';

export const CartContents = ({

}={}) => {
  const [state, setState] = useState(0);

  return (
    <div onClick={() => setState(state + 1)}>
      Hello world {state}
    </div>
  )
}

render(h(CartContents), document.getElementById('inline-cart'), new Proxy({  }, { get: console.log }));
