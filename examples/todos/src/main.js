import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import { applyPolyfill, ReflowStrategy } from 'custom-elements-hmr-polyfill';
import { querySelectorAll } from 'kagekiri';

import './todos_app.js';

setBasePath('/shoelace');

// HMR support
if (import.meta.hot) {
  import.meta.hot.accept();

  applyPolyfill(ReflowStrategy.NONE, 0, (elementName, impl, _) => {
    const element = customElements.get(elementName);

    if (element) {
      for (const prop of Object.getOwnPropertyNames(impl.prototype)) {
        const propDesc = Object.getOwnPropertyDescriptor(impl.prototype, prop);

        if (prop !== 'constructor' && propDesc && !propDesc.get && !propDesc.set) {
          element.prototype[prop] = impl.prototype[prop];
        }
      }

      querySelectorAll(elementName).forEach(e => /** @type {*} */(e).requestUpdate());
    }
  });
}
