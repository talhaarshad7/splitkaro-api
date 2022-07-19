const handleaddexpense = (req, res, groups) => {
    // Input format like:
    // {
    //     "namee": "Fruits and Milk",
    //     "items": [{ "name": "milk", "value": 50, "paid_by": [{ "A": 40, "B": 10 }], "owed_by": [{ "A": 20, "B": 20, "C": 10 }] },
    //     { "name": "fruits", "value": 50, "paid_by": [{ "A": 50 }], "owed_by": [{ "A": 10, "B": 30, "C": 10 }] }]
    // }
    const group = groups.find(c => c.namee === req.params.gname);
    if (!group) {
        res.status(404).send('The group with the given name was not found.');
        return;
    }
    group.expenses.push(req.body);
    req.body.items.forEach(element => {
        element.paid_by.forEach(x => {
            for (const [key, value] of Object.entries(x)) {
                if (!group.members.includes(key))
                    group.members.push(key);
            }
        })
        element.owed_by.forEach(x => {
            for (const [key, value] of Object.entries(x)) {
                if (!group.members.includes(key))
                    group.members.push(key);
            }
        })
    });
    res.send(group);
}
module.exports = {
    handleaddexpense: handleaddexpense
}