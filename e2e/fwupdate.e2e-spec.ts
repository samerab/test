import { FWUpdatePage, Timer, DownloadSection } from './fwupdate.po';
import { AuthHelper } from './login.po';
import { browser } from 'protractor';

describe('Firmwareupdate', () => {
    const page = new FWUpdatePage();
    const dlSection = new DownloadSection();
    const auth = new AuthHelper();

    beforeAll(function (done) {
        auth.login('Admin').then(done);
    });

    afterAll((done) => {
        auth.logout().then(done);
    });

    it('can navigate to page', () => {
        page.navigateTo();
        expect(page.getCurrentUrl()).toContain('/config/system/firmwareupdate');
    });

    it('can open download settings', function () {
        dlSection.openSettings();
        expect(dlSection.isDialogVisible()).toBeTruthy();

        dlSection.closeSettings();
    });

    it('can change serverBaseUrl', function () {
        dlSection.openSettings();
        dlSection.setServerBaseUrl('test.com:8090');
        expect(dlSection.getServerBaseUrl()).toEqual('test.com:8090');

        dlSection.closeSettings();
    });

    it('should fail on server test', function () {
        dlSection.openSettings();
        dlSection.setServerBaseUrl('klg-lnx12.eckelmann.group:8090');
        dlSection.clickTestButton();

        browser.wait(function () {
            // warten bis Validierung sichtbar ist
            return dlSection.getValidation().isDisplayed();
        });

        expect(dlSection.getStatusBarLabel().isPresent()).toBeTruthy();
        expect(dlSection.getStatusBarText()).toBe('Server unreachable');

        dlSection.closeSettings();
    });

    it('should succeed on server test', function () {
        dlSection.openSettings();
        dlSection.setServerBaseUrl('10.0.192.107:8443');
        dlSection.clickTestButton();

        browser.wait(function () {
            // warten bis Validierung sichtbar ist
            return dlSection.getValidation().isDisplayed();
        });

        expect(dlSection.getStatusBarLabel().isPresent()).toBeFalsy();

        dlSection.closeSettings();
    });

    it('can save settings', async function () {
        dlSection.openSettings();
        const lastServerBaseUrl = await dlSection.getServerBaseUrl();

        dlSection.setServerBaseUrl('test.abc.de:443');
        dlSection.clickSaveButton();

        dlSection.waitForDialogToBeClosed();

        dlSection.openSettings();
        expect(dlSection.getServerBaseUrl()).toEqual('test.abc.de:443');

        // Alten Wert wiederherstellen
        dlSection.setServerBaseUrl(lastServerBaseUrl);
        dlSection.clickSaveButton();
        dlSection.waitForDialogToBeClosed();
    });

    it('should not display settings to master', async function() {
        await auth.logout();
        await auth.login('Master');

        expect(dlSection.getDownloadSettingsButton().isPresent()).toBeFalsy();
    });
});
