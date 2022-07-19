const handledeleteexpense = (req, res, groups) => {
    const group = groups.find(c => c.namee === req.params.gname);
    if (!group) {
        res.status(404).send('The group with the given name was not found.');
        return;
    }
    group.expenses = group.expenses.filter(
        i => {
            if (i.namee.replace(/\s+/g, "") !== req.params.expense) return true;
            return false;
        }
    );
    res.send(group);
}
module.exports = {
    handledeleteexpense: handledeleteexpense
}