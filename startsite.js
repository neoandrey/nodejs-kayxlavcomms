const { exec } = require('child_process');

exec('C:\\Users\\Mobolaji.Aina\\Documents\\nodejs\\kayxlavcomms\\start_mongo_server.cmd', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

exec('C:\\Users\\Mobolaji.Aina\\Documents\\nodejs\\kayxlavcomms\\start_kayxlav.cmd', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

