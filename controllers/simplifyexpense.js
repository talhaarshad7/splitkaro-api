const handlesimplifyexpense = (req, res, groups) => {
    //create input object array
    const group = groups.find(c => c.namee === req.params.gname);
    if (!group) {
        res.status(404).send('The group with the given name was not found.');
        return;
    }
    //seperating the paid by and paid for.
    var input = [];
    group.members.forEach(element => {
        const temp = {
            paidBy: element,
            paidFor: {}
        }
        input.push(temp);
    })
    //for each transaction of i'th member add all the paidfor and subtract all paidfor for the paidfor for the corresponding member.
    function simplifyDebts(transactions) {
        var splits = new Array()
        var transaction_map = new Map();

        for (let i in transactions) {
            if (!transaction_map.has(transactions[i].paidBy)) {
                transaction_map.set(transactions[i].paidBy, 0) // net transactions map
            }
            for (let tr in transactions[i].paidFor) {
                if (!transaction_map.has(tr)) {
                    transaction_map.set(tr, 0) // net transactions map
                }
                transaction_map.set(transactions[i].paidBy, transaction_map.get(transactions[i].paidBy) + transactions[i].paidFor[tr])
                transaction_map.set(tr, transaction_map.get(tr) - transactions[i].paidFor[tr])
            }
        }
        //settling all the members having the same debt and credit.
        function settleSimilarFigures() {
            let vis = new Map();
            for (let tr1 of transaction_map.keys()) {
                vis.set(tr1, 1);
                for (let tr2 of transaction_map.keys()) {
                    if (!vis.has(tr2) && tr1 != tr2) {
                        if (transaction_map.get(tr2) == -transaction_map.get(tr1)) {
                            if (transaction_map.get(tr2) > transaction_map.get(tr1)) {
                                splits.push([tr1, tr2, transaction_map.get(tr2)])
                            } else {
                                splits.push([tr2, tr1, transaction_map.get(tr1)])
                            }
                            transaction_map.set(tr2, 0)
                            transaction_map.set(tr1, 0)
                        }
                    }
                }
            }
        }
        //selecting the max and min credit members for greedy algorithm.
        function getMaxMinCredit() {
            let max_ob, min_ob, max = Number.MIN_VALUE, min = Number.MAX_VALUE
            for (let tr of transaction_map.keys()) {
                if (transaction_map.get(tr) < min) {
                    min = transaction_map.get(tr)
                    min_ob = tr
                }
                if (transaction_map.get(tr) > max) {
                    max = transaction_map.get(tr)
                    max_ob = tr
                }
            }
            return [min_ob, max_ob];
        }
        //operating greedily on all the members recursively.
        function helper() {
            let minMax = getMaxMinCredit();
            if (minMax[0] == undefined || minMax[1] == undefined) return;
            let min_value = Math.min(-transaction_map.get(minMax[0]), transaction_map.get(minMax[1]));

            transaction_map.set(minMax[0], transaction_map.get(minMax[0]) + min_value);
            transaction_map.set(minMax[1], transaction_map.get(minMax[1]) - min_value);

            let res = [minMax[0], minMax[1], min_value];
            splits.push(res);
            helper();
        }

        settleSimilarFigures();
        helper();

        return splits;
    }



    //seperating all the paidby and owedby.
    group.expenses.forEach(element => {
        element.items.forEach(e => {
            copy_paidby = JSON.parse(JSON.stringify(e.paid_by[0]));
            copy_owedby = JSON.parse(JSON.stringify(e.owed_by[0]));
            for (const [k1, val] of Object.entries(copy_paidby)) {
                for (const [k2, val] of Object.entries(copy_owedby)) {
                    if (k1 === k2) {
                        if (copy_owedby[k2] <= copy_paidby[k1])
                            copy_paidby[k1] = copy_paidby[k1] - copy_owedby[k2];
                        copy_owedby[k1] = 0;
                    }
                    else {
                        for (const [k3, val] of Object.entries(copy_paidby)) {
                            if (k3 == k2) {
                                if (copy_paidby[k3] <= copy_owedby[k2])
                                    copy_owedby[k2] = copy_owedby[k2] - copy_paidby[k3];
                            }
                        }
                        if (copy_owedby[k2] > 0) {
                            input.forEach(ele => {
                                if (ele.paidBy === k1) {
                                    if (copy_owedby[k2] <= copy_paidby[k1]) {
                                        if (k2 in ele.paidFor)
                                            ele.paidFor[k2] = ele.paidFor[k2] + copy_owedby[k2];
                                        else
                                            ele.paidFor[k2] = copy_owedby[k2];

                                        copy_owedby[k2] = 0;
                                    }
                                    else if (copy_paidby[k1] > 0 && copy_owedby[k2] > copy_paidby[k1]) {
                                        if (k2 in ele.paidFor)
                                            ele.paidFor[k2] = ele.paidFor[k2] + copy_paidby[k1];
                                        else
                                            ele.paidFor[k2] = copy_paidby[k1];
                                        copy_owedby[k2] = copy_owedby[k2] - copy_paidby[k1];
                                        copy_paidby[k1] = 0;
                                    }
                                }
                            })
                        }


                    }

                }
            }
        })
    })
    console.log(input);
    const ans = simplifyDebts(input);
    const obj = {
        namee: req.params.gname,
        "balances": {

        }
    }
    group.members.forEach(x => {
        obj.balances[x] = {
            "total_balance": 0,
            "owes_to": [],
            "owed_by": []
        }
    })
    console.log(ans);
    //calculating the total balance for all the members.
    ans.forEach(el => {
        const f = el[0];
        const t = el[1];
        const val = el[2];
        obj.balances[f].total_balance -= val;
        const temp = Object()
        temp[t] = val;
        obj.balances[f].owes_to.push(temp);
        obj.balances[t].total_balance += val;
        const temp1 = Object();
        temp1[f] = val
        obj.balances[t].owed_by.push(temp1);
    })
    res.send(obj);
}

module.exports = {
    handlesimplifyexpense: handlesimplifyexpense
}