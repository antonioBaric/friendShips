import { LightningElement } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';

export default class BoatSearch extends LightningElement {
	isLoading = false;

	// Handles loading event
	handleLoading() {
		this.isLoading = true;
		const loadingEvent = new CustomEvent('loading', {
			detail: {
				isLoading: this.isLoading
			}
		});
		this.dispatchEvent(loadingEvent);
	}
	
	// Handles done loading event
	handleDoneLoading() {
		this.isLoading = false;
		const doneloading = new CustomEvent('doneloading', {
			detail: {
				isLoading: this.isLoading
			}
		});
		this.dispatchEvent(doneloading);
	}
	
	// Handles search boat event
	// This custom event comes from the form
	// A.B: Try to use async - await?
	searchBoats(event) {
		this.handleLoading();

		return getBoats({ boatTypeId: event.detail.boatTypeId })
		.then(boats => {
// TODO: A.B: Remove later!
			console.log('FILTERED-BOATS: ', boats);
		})
		.catch(error => {
			console.error(error);
		})
		.finally(() => {
			this.handleDoneLoading();
		})
	}
	
	createNewBoat() { }
}
