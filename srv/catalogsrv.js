const cds = require('@sap/cds');  // cds is object of @sap/cds- library which is used to connect to database and perform operations on database
const { books } = cds.entities;  // Books is entity type

module.exports = srv => {    // srv is arrow function this name may be diffrent but stnadrd coding take as srv
    const db = cds.db;  // db is object of cds.db which is used to connect to database // provide all sql query

    // READ is used to read the data from the database // BooksSet is entity set from service
    srv.on('READ', 'BooksSet', async (req, res) => {  // srv.on is used to handle the request and response of the service // BooksSet if entity set from service
        let results = [];
        results = await db.run([                // db.run is used to run the sql query // SELECT.from is used to select the data from the entity type Books
            SELECT.from(books) //.where({ID : req.data.ID})  // where is used to filter the data based on the ID which is passed in the request parameter
        ])
            .then((resolve, reject) => {  // then is used to handle the promise // resolve is used to handle the success response // reject is used to handle the error response
                if (resolve) {  // if resolve is true then return the results
                    return resolve;
                } else {  // if resolve is false then return the error message
                    return req.error(400, 'Failed to Read');
                }
            })
            .catch(err => {  // catch is used to handle the error response
                req.error(500, 'Try After Some Time....' + err.toString());
            });
        return results;  // return the results to the client
    });

    // CREATE
    srv.on('CREATE', 'BooksSet', async (req, res) => {  // async is used to handle the asynchronous operation // req is request object // res is response object
        let results = [];
        results = await db.run([
            INSERT.into(books).entries(req.data)  // INSERT.into is used to insert the data into the entity type Books // entries is used to insert the data into the entity type Books
        ])
            .then((resolve, reject) => {  // then is used to handle the promise // resolve is used to handle the success response // reject is used to handle the error response
                if (resolve) {
                    return req.data;
                }
                else {
                    return req.error(400, 'Failed to create');
                }
            })
            .catch(err => {
                req.error(500, 'Try Ater Some Time....' + err.toString());
            })
        return results;
    });

    // UPDATE
    srv.on('UPDATE', 'BooksSet', async (req, resp) => {  // UPDATE is used to update the data in the database // BooksSet is entity set from service
        let results = [];
        results = await db.run([
            UPDATE(books).set(req.data).where({ ID: req.data.ID })  // UPDATE is used to update the data in the entity type Books // set is used to set the data which is passed in the request parameter // where is used to filter the data based on the ID which is passed in the request parameter
        ])
            .then((resolve, reject) => {
                if (resolve) {
                    return req.data;
                }
                else {
                    return req.error(400, 'Failed To Update');
                }
            })
            .catch(err => {
                req.error(500, 'Try After Some Time....' + err.toString());
            })
        return results;
    })

    // DELETE

    // srv.on('DELETE', 'BooksSet', async (req, res) => {
    //     let results = [];
    //     results = await db.run([
    //         DELETE.from(books).where({ ID: req.data.ID })  // DELETE.from is used to delete the data from the entity type Books // where is used to filter the data based on the ID which is passed in the request parameter
    //     ])
    //         .then((resolve, reject) => {
    //             if (resolve) {
    //                 return req.data;
    //             } else {
    //                 return req.error(400, 'Failed To Delete');
    //             }
    //         })
    //         .catch(err => {
    //             req.error(500, 'Try After Some Time....' + err.toString());
    //         });
    //     return results;
    // })


    srv.on('DELETE', 'BooksSet', async (req) => {
        try {
            // Step 1: Fetch records that are about to be deleted
            const recordsToDelete = await db.run(
                SELECT.from(books).where({ ID: req.data.ID })
            );

            if (!recordsToDelete || recordsToDelete.length === 0) {
                return req.error(404, 'No record found to delete');
            }

            // Step 2: Delete those records
            await db.run(
                DELETE.from(books).where({ ID: req.data.ID })
            );


            // ⚠️ Force custom response
            req._.res.status(200).json(recordsToDelete);

            // Step 3: Return deleted records
            return recordsToDelete;

        } catch (err) {
            return req.error(500, 'Try After Some Time.... ' + err.toString());
        }
    });
}
