import DS from 'ember-data';

export default DS.RESTSerializer.extend({

    isNewSerializerAPI: true,
    keyForRelationship: function(key) {
        return key + 'Id';
    }
});