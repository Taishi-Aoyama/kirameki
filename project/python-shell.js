var {PythonShell} = require('python-shell');

PythonShell.runString('print("Hello Python")', null, function(err, result) {
  if(err) throw err;

  console.log(result);
});