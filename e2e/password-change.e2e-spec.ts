import { AuthHelper } from './login.po';
import { PasswordChangePage } from './password-change.po';
import { Key } from 'protractor';

describe('Password-Change', () => {
  const auth = new AuthHelper();
  const page = new PasswordChangePage();

  beforeAll(function(done) {
    auth
      .login('Admin')
      .then(() => page.setLanguage('de'))
      .then(done);
  });

  beforeEach(done => {
    page.navigateTo().then(done);
  });

  afterAll(done => {
    auth.logout().then(done);
  });

  it('should not allow master to open page', () => {
    auth.logout();
    auth.login('Master');
    page.navigateTo();

    expect(page.getCurrentUrl()).not.toContain('/config/system/changepassword');
    auth.logout();
    auth.login('Admin');
  });

  it('should navigate to page', () => {
    expect(page.getCurrentUrl()).toContain('/config/system/changepassword');
  });

  it('should mark password field as valid', () => {
    page.getPasswordInput('Admin').sendKeys('abc123ABC');

    expect(page.getPasswordInput('Admin').getAttribute('className')).toContain('ng-valid');
  });

  it('should mark password field as invalid', () => {
    page.getPasswordInput('Admin').sendKeys('abcBC');

    expect(page.getPasswordInput('Admin').getAttribute('className')).toContain('ng-invalid');
  });

  it('should mark password confirmation field as valid', () => {
    page.getPasswordInput('Admin').sendKeys('abc');
    page.getConfirmPasswordInput('Admin').sendKeys('abc');

    expect(page.getConfirmPasswordInput('Admin').getAttribute('className')).toContain('ng-valid');
  });

  it('should mark password confirmation field as invalid', () => {
    page.getPasswordInput('Admin').sendKeys('abc');
    page.getConfirmPasswordInput('Admin').sendKeys('dbe');

    expect(page.getConfirmPasswordInput('Admin').getAttribute('className')).toContain('ng-invalid');
  });

  it('should show validation hint', () => {
    page.getPasswordInput('Admin').sendKeys('abc');

    page.getValidationHint('Admin').then(htmlList => {
      expect(htmlList.length).toBe(1);
      expect(htmlList[0]).toContain('a-z');
    });

    page.getPasswordInput('Admin').sendKeys('ABC');

    page.getValidationHint('Admin').then(htmlList => {
      expect(htmlList.length).toBe(2);
      expect(htmlList[1]).toContain('A-Z');
    });
  });

  it('should show validation errors', () => {
    page.getPasswordInput('Admin').sendKeys('12admin');

    page.getValidationHint('Admin').then(hints => {
      expect(hints.length).toBe(3);
      expect(hints[0]).toContain('Enthält den Rollennamen');
      expect(hints[1]).toContain('0-9');
      expect(hints[2]).toContain('a-z');
    });

    page.getPasswordInput('Admin').sendKeys(Key.BACK_SPACE);
    page.getPasswordInput('Admin').sendKeys('!');

    page.getValidationHint('Admin').then(hints => {
      expect(hints.length).toBe(3);
      expect(hints[0]).toContain('Enthält ungültige Zeichen');
      expect(hints[1]).toContain('0-9');
    });
  });
});
