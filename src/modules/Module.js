'use strict';
class Module {

	insert(id, data) {
		this.id = id;
		this.element = document.createElement('div')
		this.element.id = this.id

		if(!this.reactClass) {
			alert('holy shit no reactClass was defined')
		}

		ReactDOM.render(
  			R.ce(this.reactClass, data), this.element
		);

		document.getElementById('Content').appendChild(ele)
	}
}