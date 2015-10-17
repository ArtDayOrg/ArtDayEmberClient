import DS from 'ember-data';

export default DS.RESTSerializer.extend({
    isNewSerializerAPI: true,
    keyForRelationship: function(key) {
        // add 'Id' to the end of relationships in the models.
        // e.g. this:
        // {"preference":{"rank":5,"session":"14","student":"696"}}
        // ->
        // {"preference":{"rank":5,"sessionId":"14","studentId":"696"}}
        return key + 'Id';
    }
});