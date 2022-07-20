const handlecreategroup = (req, res, groups) => {
    // Input format like:
    // {
    //     "namee":"Home",
    //     "members":"A,B,C"
    // }
    const group = {
        namee: req.body.namee,
        members: req.body.members.split(","),
        expenses: []
    }
    groups.push(group);
    console.log(group);
    res.send();
}

module.exports = {
    handlecreategroup: handlecreategroup
};
