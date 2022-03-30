import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { api, LightningElement, wire } from 'lwc';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = [];
  boatTypeId = '';
  boats;
  isLoading = false;
  
  // wired message context
  messageContext;

  // wired getBoats method 
  @wire(getBoats, { boatTypeId: '$boatTypeId' })
  wiredBoats(result) {
	if (result.error) {
		console.error(error);
	} else {
		console.log('wiredBoats: ', result);
		if (result.data) {
			this.boats = result.data;
		}
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
  refresh() { }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
	  this.selectedBoatId = event.detail.boatId;
	  // TODO A.B:sendMessageService
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then(() => {})
    .catch(error => {})
    .finally(() => {});
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
	this.isLoading = isLoading;
	if (this.isLoading) {
		const loadingEvent = new CustomEvent('loading', {
			detail: {
				isLoading: this.isLoading
			}
		});
		this.dispatchEvent(loadingEvent);
	} else {
		const doneloading = new CustomEvent('doneloading', {
			detail: {
				isLoading: this.isLoading
			}
		});
		this.dispatchEvent(doneloading);
	}
  }
}

