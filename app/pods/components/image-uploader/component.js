import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  url: '',

  filesDidChange: function(files) {

    var file = files[0];
    console.log(file);
    this.sendAction('updateImageData', file);

    // var reader = new FileReader();
    // var self = this;
    // reader.onload = function(readerEvt) {
    //   var binaryString = readerEvt.target.result;
    //   self.set('imageData', btoa(binaryString));
    //   self.sendAction('updateImageData', btoa(binaryString));
    // };
    // reader.readAsBinaryString(file);
  }
});