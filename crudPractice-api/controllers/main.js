
// selects all from table, once it comes back, will send out as json, if not will say it doesn't exist. 
// .then is a promise function, nice way to write callbacks, can chain things. before, with callbacks, callback hell, would have to nest a ton of them. 
const getTableData = (req, res, db) => {
    db.select('*').from('testtable1')
    // items just generic name being used as a reference
      .then(items => {
        if(items.length){
          res.json(items)
        } else {
          res.json({dataExists: 'false'})
        }
      })
      // could make other requests using .then() here
      // but now supplanted by async await syntax
      // error catcher will happen if any .then in chain has error
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }

  const postTableData = (req, res, db) => {
    const { first, last, email, phone, location } = req.body
    const added = new Date()
    db('testtable1').insert({first, last, email, phone, location, added})
      .returning('*')
      .then(item => {
        res.json(item)
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const putTableData = (req, res, db) => {
    const { id, first, last, email, phone, location } = req.body
    db('testtable1').where({id}).update({first, last, email, phone, location})
      .returning('*')
      .then(item => {
        res.json(item)
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  const deleteTableData = (req, res, db) => {
    const { id } = req.body
    db('testtable1').where({id}).del()
      .then(() => {
        res.json({delete: 'true'})
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
  }
  
  module.exports = {
    getTableData,
    postTableData,
    putTableData,
    deleteTableData
  }