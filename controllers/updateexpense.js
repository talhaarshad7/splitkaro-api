const handleupdateexpense = (req, res, groups) => {
    // Input format like:
    // {
    //     "namee": "Fruits and Milk",
    //     "items": [{ "name": "yoghurt", "value": 50, "paid_by": [{ "A": 40, "B": 10 }], "owed_by": [{ "A": 20, "B": 20, "C": 10 }] },
    //     { "name": "fruits", "value": 50, "paid_by": [{ "A": 50 }], "owed_by": [{ "A": 10, "B": 30, "C": 10 }] }]
    // }


    const group = groups.find(c => c.namee === req.params.gname);
    if (!group) {
        res.status(404).send('The group with the given name was not found.');
        return;
    }
    const expense = group.expenses.find(c => c.namee === req.body.namee)
    if (!expense) {
        res.status(404).send('The expense with the given expense name was not found.');
        return;
    }
    expense.items = req.body.items;
    res.send(group);
}
module.exports = {
    handleupdateexpense: handleupdateexpense
}