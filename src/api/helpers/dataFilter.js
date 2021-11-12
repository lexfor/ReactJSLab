export function dataFilter(rows) {
  return rows.map((row) => {
    if (row.password) {
      delete row.password;
    }
    if (row.role_id) {
      delete row.role_id;
    }
    if (row.login) {
      delete row.login;
    }
    return row;
  });
}
