import DS from 'ember-data';

export default DS.RESTSerializer.extend({
    isNewSerializerAPI: true,
    keyForRelationship: function(key) {
        // Purpose of this method is to add 'Id' to the end of relationships in the models.
        // For example, this:
        // {"preference":{"rank":5,"session":"14","student":"696"}}
        // turns into this:
        // {"preference":{"rank":5,"sessionId":"14","studentId":"696"}}
        // And the server is able to serialize this into a preference object.
        return key + 'Id';
    }
});