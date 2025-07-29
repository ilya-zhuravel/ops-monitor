db = db.getSiblingDB('ops-monitor');
db.createUser({
  user: 'root',
  pwd: 'Password1',
  roles: [{ role: 'readWrite', db: 'ops-monitor' }]
});
