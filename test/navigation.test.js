import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BaseComponent, html, Router } from '../index.js';

class UserListPage extends BaseComponent {
  render() {
    return html`
      <h1>User list</h1>
      <button id="user-details-button" @click=${() => this.#goToDetails()}>Details</button>
    `;
  }

  #goToDetails() {
    this.navigate('/users/42?status=active', {
      params: {
        user: {
          id: 42,
          fullName: 'Test User'
        },
        status: {
          active: true,
          passwordChangeDays: 10
        }
      }
    });
  }
}

class UserDetailsPage extends BaseComponent {
  set user(user) {
    this.setProps({ user });
  }

  set status(status) {
    this.setProps({ status });
  }

  render({ user, status }) {
    return html`
      <h1>User details</h1>
      Full name:
      <p id="user-full-name">${user?.fullName ?? user}</p>
      Password change in (days):
      <p id="password-change-days">${status?.passwordChangeDays ?? status}</p>
    `;
  }
}

customElements.define('user-list-page', UserListPage);
customElements.define('user-details-page', UserDetailsPage);

class MainApp extends BaseComponent {
  connectedCallback() {
    super.connectedCallback();

    const outlet = this.shadowRoot?.querySelector('main');
    const router = new Router(outlet);

    router.setRoutes([
      { path: '/', component: 'user-list-page' },
      { path: '/users/:user', component: 'user-details-page' }
    ]);
  }

  render() {
    return html`<main id="main"></main>`;
  }
}

customElements.define('main-app', MainApp);

describe('BaseComponent (navigation)', () => {
  /** @type {MainApp} */
  let mainApp;

  beforeEach(() => {
    mainApp = new MainApp();

    document.body.appendChild(mainApp);
  });

  afterEach(() => {
    mainApp.remove();
  });

  it('navigates and passes complex objects via window', async () => {
    // Given
    await new Promise(resolve => requestAnimationFrame(resolve)); // Let router render

    const pageOne = mainApp?.shadowRoot?.querySelector('user-list-page');
    const userDetailsButton = pageOne?.shadowRoot?.getElementById('user-details-button');

    // When
    userDetailsButton?.click();

    // Then
    await new Promise(resolve => requestAnimationFrame(resolve)); // Let navigation complete

    const pageTwo = mainApp?.shadowRoot?.querySelector('user-details-page');
    const userFullName = pageTwo?.shadowRoot?.getElementById('user-full-name');
    const passwordChangeDays = pageTwo?.shadowRoot?.getElementById('password-change-days');

    expect(userFullName?.textContent).toBe('Test User');
    expect(passwordChangeDays?.textContent).toBe('10');
  });

  it('renders target page using only URL parameters', async () => {
    // Given
    await new Promise(resolve => requestAnimationFrame(resolve)); // Let router render

    // When
    Router.go('/users/999?status=inactive'); // Navigate directly without using navigate(), so no window param is passed

    // Then
    await new Promise(resolve => requestAnimationFrame(resolve)); // Let navigation complete

    const pageTwo = mainApp?.shadowRoot?.querySelector('user-details-page');
    const userFullName = pageTwo?.shadowRoot?.getElementById('user-full-name');
    const passwordChangeDays = pageTwo?.shadowRoot?.getElementById('password-change-days');

    expect(userFullName?.textContent).toBe('999');
    expect(passwordChangeDays?.textContent).toBe('inactive');
  });
});
