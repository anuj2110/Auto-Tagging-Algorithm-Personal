//route for update data
app.post('/update',(req, res) => {
    let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
  });
  
  //route for delete data
  app.post('/delete',(req, res) => {
    let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect('/');
    });
  });