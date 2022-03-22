import { api, LightningElement } from 'lwc';

const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';
const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';

export default class BoatTile extends LightningElement {
	@api boat;
	@api selectedBoatId;
	
	// Getter for dynamically setting the background image for the picture
	get backgroundStyle() {
		return `background-image:url("${boat.Picture__c}")`;
	}
	
	// Getter for dynamically setting the tile class based on whether the
	// current boat is selected
	get tileClass() {
		if (this.boat.Id === this.selectedBoatId) {
			return TILE_WRAPPER_SELECTED_CLASS;
		} else {
			return TILE_WRAPPER_UNSELECTED_CLASS;
		}
	}
	
	// Fires event with the Id of the boat that has been selected.
	selectBoat() {
		// this.selectedBoatId = boat.Id;
		const selectBoatEvent = new CustomEvent('boatselect', {
			detail: {
				boatId: this.boat.Id
			}
		});
		this.dispatchEvent(selectBoatEvent);
	}
  }
  
