import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  url: '',

  filesDidChange: function(files) {

    var file = files[0];

    var reader = new FileReader();
    var self = this;
    reader.onload = function(readerEvt) {
      var binaryString = readerEvt.target.result;
      self.sendAction('updateImageData', file, btoa(binaryString));
    };
    reader.readAsBinaryString(file);
  }
});