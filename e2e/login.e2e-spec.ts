import { LoginPage, AuthHelper } from './login.po';

describe('Login', () => {
  let page: LoginPage;
  const auth: AuthHelper = new AuthHelper();

  beforeAll((done) => {
    auth.logout().then(done);
  });

  beforeEach(() => {
    page = new LoginPage();
  });

  afterAll((done) => {
    auth.logout().then(done);
  });

  it('should open login page', () => {
    page.navigateTo();
    expect(page.getUserName()).toBeFalsy();
  });

  it('should enable login button', () => {
    page.navigateTo();

    expect(page.isLoginDisabled()).toBeTruthy();

    page.setUserName('Tester');
    page.setPassword('Passwd');

    expect(page.isLoginDisabled()).toBeFalsy();
  });


  it('should not login', () => {
    page.navigateTo();

    page.setUserName('Tester');
    page.setPassword('Passwd');

    page.getLoginButton().click();

    expect(page.getPassword()).toBeFalsy();

    page.getFormErrors(errors => {
      expect(errors.length).toBe(2);
    });
  });

  it('should login', () => {
    page.navigateTo();

    page.setUserName('Master');
    page.setPassword('0000');

    page.getLoginButton().click();

    expect(page.getUrl().then(url => !url.endsWith('/login'))).toBeTruthy();

    page.getLogoutButton().click();
  });
});
