import { api, LightningElement } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';

export default class BoatsNearMe extends LightningElement {
	@api
	boatTypeId;

	
}
