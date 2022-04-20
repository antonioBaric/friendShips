import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { api, LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/boatMessageChannel__c';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  boatTypeId = '';
  boats;
  isLoading = false;

  columns = [
	{ label: 'Name', fieldName: 'Name', type: 'text', editable: true },
	{ label: 'Length', fieldName: 'Length__c', type: 'text', editable: true },
	{ label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
	{ label: 'Description', fieldName: 'Description__c', type: 'text', editable: true },
  ];

  // A.B: Wired Apex result so it can be refreshed programmatically
  wiredBoatsResults;
  
  // wired message context
  @wire(MessageContext)
  messageContext;

  // wired getBoats method 
  @wire(getBoats, { boatTypeId: '$boatTypeId' })
  wiredBoats({ data, error }) {
	this.wiredBoatsResults = data;
	if (data) {
		this.boats = data;
	} else if (error) {
		console.error(error);
	}
	this.notifyLoading(false);
  }
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
	  console.log('Selected boat type id: ', boatTypeId);
	  this.notifyLoading(true);
	  this.boatTypeId = boatTypeId;
  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api
  async refresh() {
	this.isLoading = true;
	this.notifyLoading(this.isLoading);      
	await refreshApex(this.boats);
	this.isLoading = false;
	this.notifyLoading(this.isLoading);
  }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
	  this.selectedBoatId = event.detail.boatId;
	  this.sendMessageService(this.selectedBoatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
	const payload = { recordId: boatId };
	publish(this.messageContext, BOATMC, payload);
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
	this.notifyLoading(true);
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    return updateBoatList({data: updatedFields})
    .then(result => {
		// this.showToast(SUCCESS_VARIANT, SUCCESS_TITLE, MESSAGE_SHIP_IT);
		const toast = new ShowToastEvent({
			title: SUCCESS_TITLE,
			message: MESSAGE_SHIP_IT,
			variant: SUCCESS_VARIANT,
		});
		this.dispatchEvent(toast);
		return this.refresh()
	})
    .catch(error => {
		this.notifyLoading(false);
		// this.showToast(ERROR_VARIANT, ERROR_TITLE, error.message);
		const toast = new ShowToastEvent({
			title: ERROR_TITLE,
			message: error.message,
			variant: ERROR_VARIANT,
		});
		this.dispatchEvent(toast);
		console.error(error);
	})
    .finally(() => {
		this.template.querySelector("lightning-datatable").draftValues = [];
	});
  }

  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
	if (isLoading) {
		this.dispatchEvent(new CustomEvent('loading'));
	} else {
		this.dispatchEvent(CustomEvent('doneloading'));
	}        
}

  showToast(variant, title, message) {
	const event = new ShowToastEvent({
		variant: variant,
		title: title,
		message: message
	});
	this.dispatchEvent(event);
  }
}

