var server = require('./server');
var ds = server.dataSources.db;
var lbTables = [
  'Worker',
  'AccessToken',
  'ACL',
  'RoleMapping',
  'Role',
  'Worker',
  'Third',
  'Provider',
  'Client',
  'Proposal',
  'Service',
  'Budget',
  'Project',
  'Departments'
];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});
