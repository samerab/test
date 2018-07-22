import { browser, by, element, Key } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get('/login');
  }

  getUserName() {
    return element(by.css('#username')).getAttribute('value');
  }

  setUserName(username) {
    return element(by.css('#username')).sendKeys(username);
  }

  getPassword() {
    return element(by.css('#password')).getAttribute('value');
  }

  setPassword(passwd) {
    return element(by.css('#password')).sendKeys(passwd);
  }

  isLoginDisabled() {
    return element(by.css('button[type=submit]')).getAttribute('disabled');
  }

  getFormErrors(cb: (errors: string[]) => void) {
    const errElements = element.all(by.css('.help-block'));

    return errElements.filter(errElem => errElem.isDisplayed()).then(cb, err => cb([]));
  }

  getLoginButton() {
    return element(by.css('button[type=submit]'));
  }

  getLogoutButton() {
    return element(by.css('.logout'));
  }

  tryToLogout() {
    const logoutBtn = this.getLogoutButton();
    return logoutBtn.isPresent().then(present => {
      if (present) {
        return logoutBtn.click();
      }
    });
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

}

export class AuthHelper {
  private loginPage = new LoginPage();

  ensureIsLoggedIn() {
    return browser.wait(() => {
      return this.loginPage.getLogoutButton().isPresent();
    });
  }

  ensureIsLoggedOut() {
    return browser.wait(() => {
      return this.loginPage.getLogoutButton().isPresent().then(present => !present);
    });
  }

  login(role: string = 'Master', password: string = '0000') {
    this.loginPage.navigateTo();
    this.loginPage.setUserName(role);
    this.loginPage.setPassword(password);
    this.loginPage.getLoginButton().click();

    return this.ensureIsLoggedIn();
  }

  logout() {
    return this.loginPage.navigateTo().then(() => {
      return this.loginPage.tryToLogout();
    }).then(() => {
      return this.ensureIsLoggedOut();
    });
  }
}
