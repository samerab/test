import { browser, $$, element, by, ElementFinder } from 'protractor';
import { LoginPage, AuthHelper } from './login.po';

export class PasswordChangePage {
  setLanguage(langCode: string = 'de') {
    return element(by.id('lang-' + langCode)).click();
  }

  navigateTo() {
    return browser.get('/config/system/changepassword');
  }

  getCurrentUrl() {
    return browser.getCurrentUrl();
  }

  getPasswordInput(role: string): ElementFinder {
    if (role.toLowerCase() === 'admin') {
      return $$('input.password').get(0);
    } else if (role.toLowerCase() === 'master') {
      return $$('input.password').get(1);
    } else if (role.toLowerCase() === 'service') {
      return $$('input.password').get(2);
    }
  }

  getConfirmPasswordInput(role: string): ElementFinder {
    if (role.toLowerCase() === 'admin') {
      return $$('input.password-confirm').get(0);
    } else if (role.toLowerCase() === 'master') {
      return $$('input.password-confirm').get(1);
    } else if (role.toLowerCase() === 'service') {
      return $$('input.password-confirm').get(2);
    }
  }

  getValidationHint(role: string) {
    const passwd = this.getPasswordInput(role);
    return passwd
      .element(by.xpath('..'))
      .$$('eag-password-validation ul>li')
      .map(v => v.getText());
  }
}
