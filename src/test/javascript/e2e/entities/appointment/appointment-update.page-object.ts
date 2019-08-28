import { element, by, ElementFinder } from 'protractor';

export default class AppointmentUpdatePage {
  pageTitle: ElementFinder = element(by.id('wisestepApp.appointment.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  fixedDateInput: ElementFinder = element(by.css('input#appointment-fixedDate'));
  symptomsInput: ElementFinder = element(by.css('input#appointment-symptoms'));
  statusSelect: ElementFinder = element(by.css('select#appointment-status'));
  startTimeInput: ElementFinder = element(by.css('input#appointment-startTime'));
  endTimeInput: ElementFinder = element(by.css('input#appointment-endTime'));
  patientSelect: ElementFinder = element(by.css('select#appointment-patient'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setFixedDateInput(fixedDate) {
    await this.fixedDateInput.sendKeys(fixedDate);
  }

  async getFixedDateInput() {
    return this.fixedDateInput.getAttribute('value');
  }

  async setSymptomsInput(symptoms) {
    await this.symptomsInput.sendKeys(symptoms);
  }

  async getSymptomsInput() {
    return this.symptomsInput.getAttribute('value');
  }

  async setStatusSelect(status) {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect() {
    return this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption() {
    await this.statusSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async setStartTimeInput(startTime) {
    await this.startTimeInput.sendKeys(startTime);
  }

  async getStartTimeInput() {
    return this.startTimeInput.getAttribute('value');
  }

  async setEndTimeInput(endTime) {
    await this.endTimeInput.sendKeys(endTime);
  }

  async getEndTimeInput() {
    return this.endTimeInput.getAttribute('value');
  }

  async patientSelectLastOption() {
    await this.patientSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async patientSelectOption(option) {
    await this.patientSelect.sendKeys(option);
  }

  getPatientSelect() {
    return this.patientSelect;
  }

  async getPatientSelectedOption() {
    return this.patientSelect.element(by.css('option:checked')).getText();
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
