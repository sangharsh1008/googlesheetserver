

export const addUser = function(req,res){
  if(req.body&&req.body.name){
    res.send('hello')
  }
}
