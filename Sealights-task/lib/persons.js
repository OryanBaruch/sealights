import _ from "lodash";

const persons = () => {

    const persons = [];

    const addPerson = (persons) => (payload) => {
        const { name, birthdate, addresses } = payload;
        if (_.some([name, addresses], _.isEmpty)) {
            throw new Error('Missing or invalid argument for adding a city [name, addresses]');
        }

        const id = persons.length;
        persons.push({
            id,
            name: name || "NA",
            birthdate: birthdate || "NA",
            addresses
        })
    }   

    return {
        addPerson: addPerson(persons),
        getPersons: () => persons
    };
}

export const { 
    addPerson,
    getPersons
} = persons();