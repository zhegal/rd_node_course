const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Robert' },
];
const acceptFields = ['name'];

function generateId() {
    const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
    return maxId + 1;
}

function filterData(data) {
    return Object.fromEntries(
        Object.entries(data).filter(([key]) => acceptFields.includes(key))
    );
}

export const userModel = {
    findAll() {
        return users;
    },
    findById(id) {
        return users.find(user => user.id === id);
    },
    create(data) {
        const filteredData = filterData(data);
        const newUser = {
            id: generateId(),
            ...filteredData,
        }
        users.push(newUser);
        return newUser;
    },
    update(id, data) {
        const index = users.findIndex(user => user.id === id);
        if (index === -1) return false;
        const filteredData = filterData(data);
        users[index] = {
            ...users[index],
            ...filteredData,
        }
        return users[index];
    },
    remove(id) {
        const index = users.findIndex(user => user.id === id);
        if (index === -1) return false;
        users.splice(index, 1)
        return true;
    }
};
