import Ember from 'ember';
import AdminControllerHooks from 'art-day/mixins/admin-controller-hooks';

export default Ember.Controller.extend(AdminControllerHooks, {

	actions: {
		enroll: function () {
			this.get('adminController').send('enroll');
		}
	}
});
