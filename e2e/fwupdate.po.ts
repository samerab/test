import { browser, element, by } from 'protractor';
import * as path from 'path';
import { Key } from 'selenium-webdriver';

export function Timer(ms: number) {
    let done = false;

    setTimeout(() => {
        done = true;
    }, ms);

    return browser.wait(() => {
        return done;
    });
}


export class DownloadSection {
    openSettings() {
        return this.getDownloadSettingsButton().click();
    }

    closeSettings() {
        const closeBtn = this.getModalCloseButton();
        return closeBtn.isDisplayed().then(visible => {
            if (visible) {
                return closeBtn.click();
            }
        });
    }

    setServerBaseUrl(url: string) {
        const input = this.getServerBaseUrlInput();
        return input.clear().then(() => input.sendKeys(url));
    }

    getServerBaseUrl() {
        return this.getServerBaseUrlInput().getAttribute('value');
    }

    clickTestButton() {
        return this.getTestButton().click();
    }

    clickSaveButton() {
        return this.getSaveButton().click();
    }

    getStatusBarText() {
        return this.getStatusBarLabel().getText();
    }

    isDialogVisible() {
        return this.getModalWrapper().getAttribute('class')
            .then(className => className.indexOf('in') >= 0);
    }

    waitForDialogToBeClosed() {
        return browser.wait(() => this.getModalWrapper().isDisplayed().then(d => !d));
    }

    //#region Selectors

    getValidation() {
        return element(by.css('eag-download-settings label.val-ok, eag-download-settings label.val-error'));
    }

    getModalCloseButton() {
        return element(by.css('eag-download-settings button.close'));
    }

    getModalWrapper() {
        return element(by.css('eag-download-settings div.modal'));
    }

    getDownloadSettingsButton() {
        return element(by.css('button.settings'));
    }

    getServerBaseUrlInput() {
        return element(by.css('eag-download-settings input.address'));
    }

    getTestButton() {
        return element(by.css('eag-download-settings button.test'));
    }

    getSaveButton() {
        return element(by.css('eag-download-settings button.save'));
    }

    getStatusBarLabel() {
        return element(by.css('eag-download-settings .status-bar-text'));
    }

    //#endregion
}


export class FWUpdatePage {
    private fwFileHiddenInputSelector = '#fw-file-picker input[type=file]';
    private fwFileSelector = '#fw-file-picker input.file-label';
    private licenceFileSelector = '#licence-file-picker input.file-label';

    showFileInput() {
        return browser.executeScript(function () {
            const elem = document.querySelector(this.fwFileHiddenInputSelector);
            if (elem) {
                elem.setAttribute('style', 'display:inline;');
            }
        });
    }

    navigateTo() {
        return browser.get('/config/system/firmwareupdate');
    }

    getCurrentUrl() {
        return browser.getCurrentUrl();
    }

    pickFileToUpload(absolutePath: string) {
        element(by.css(this.fwFileHiddenInputSelector)).sendKeys(absolutePath);
    }

    getSelectedFirmwareFile() {
        return element(by.css(this.fwFileSelector)).getAttribute('value');
    }

    getSelectedLicenceFile() {
        return element(by.css(this.licenceFileSelector)).getAttribute('value');
    }

    getFeedbackLabeltext() {
        return element(by.id('status')).getText();
    }

    getUploadButton() {
        return element(by.id('upload-btn'));
    }

    getUpdateButton() {
        return element(by.id('update-btn'));
    }

    getCurrentSystemVersion() {
        return element(by.className('current-system-info')).getText();
    }

    getRaucbFileVersion() {
        return element(by.className('current-file-info')).getText();
    }

    /**
     * Erzeugt einen absoluten Pfad basierend einem Pfad relativ zum e2e Ordner.
     *
     * @param {string} relativePath
     * @returns
     *
     * @memberof FWUpdatePage
     */
    createPathRelativeToProjectFolder(relativePath: string): string {
        return path.resolve(__dirname, relativePath);
    }


    /**
     * Wartet darauf, dass der Popupdialog angezeigt wird und gibt dann den Textinhalt zurück.
     *
     * @returns
     *
     * @memberof FWUpdatePage
     */
    getPopupDialogText() {
        return browser.wait(element(by.css('.modal-content .modal-body')).isDisplayed).then(() => {
            return element(by.css('.modal-content .modal-body')).getText();
        });
    }
}
