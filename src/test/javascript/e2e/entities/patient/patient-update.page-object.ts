import { element, by, ElementFinder } from 'protractor';

export default class PatientUpdatePage {
  pageTitle: ElementFinder = element(by.id('wisestepApp.patient.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  fullnameInput: ElementFinder = element(by.css('input#patient-fullname'));
  genderSelect: ElementFinder = element(by.css('select#patient-gender'));
  phoneInput: ElementFinder = element(by.css('input#patient-phone'));
  addressInput: ElementFinder = element(by.css('input#patient-address'));
  emailInput: ElementFinder = element(by.css('input#patient-email'));
  birthdateInput: ElementFinder = element(by.css('input#patient-birthdate'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setFullnameInput(fullname) {
    await this.fullnameInput.sendKeys(fullname);
  }

  async getFullnameInput() {
    return this.fullnameInput.getAttribute('value');
  }

  async setGenderSelect(gender) {
    await this.genderSelect.sendKeys(gender);
  }

  async getGenderSelect() {
    return this.genderSelect.element(by.css('option:checked')).getText();
  }

  async genderSelectLastOption() {
    await this.genderSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setPhoneInput(phone) {
    await this.phoneInput.sendKeys(phone);
  }

  async getPhoneInput() {
    return this.phoneInput.getAttribute('value');
  }

  async setAddressInput(address) {
    await this.addressInput.sendKeys(address);
  }

  async getAddressInput() {
    return this.addressInput.getAttribute('value');
  }

  async setEmailInput(email) {
    await this.emailInput.sendKeys(email);
  }

  async getEmailInput() {
    return this.emailInput.getAttribute('value');
  }

  async setBirthdateInput(birthdate) {
    await this.birthdateInput.sendKeys(birthdate);
  }

  async getBirthdateInput() {
    return this.birthdateInput.getAttribute('value');
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
