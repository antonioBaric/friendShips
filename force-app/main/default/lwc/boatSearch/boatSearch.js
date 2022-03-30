import { LightningElement } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';

export default class BoatSearch extends LightningElement {
	isLoading = false;
	boatTypeId;

	// Handles loading event
	handleLoading() {
		this.isLoading = true;
	}

	// Handles done loading event
	handleDoneLoading() {
		this.isLoading = false;
	}
	
	// Handles search boat event
	// This custom event comes from the form
	// A.B: Try to use async - await? ...Also, what is the purpose of this function if it doesn't forward the data!?
	searchBoats(event) {
		if (event.detail && event.detail.boatTypeId !== undefined) {
			this.boatTypeId = event.detail.boatTypeId;
			this.template.querySelector('c-boat-search-results').searchBoats(this.boatTypeId);
		}
	}
	
	createNewBoat() { }
}
