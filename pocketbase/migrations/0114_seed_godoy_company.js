migrate(
  (app) => {
    const companies = app.findCollectionByNameOrId('companies')
    let company
    try {
      company = app.findFirstRecordByData('companies', 'name', 'Godoy Prime Realty')
    } catch (_) {
      company = new Record(companies)
      company.set('name', 'Godoy Prime Realty')
      company.set('segment', 'imobiliaria_estruturada_premium')
      app.save(company)
    }

    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      const marcus = app.findAuthRecordByEmail('_pb_users_auth_', 'marcus@godoyprime.com.br')
      marcus.set('company', company.id)
      marcus.set('is_admin', true)
      marcus.set('role', 'admin')
      marcus.set('name', 'Marcus Godoy')
      app.save(marcus)
    } catch (_) {
      const marcus = new Record(users)
      marcus.setEmail('marcus@godoyprime.com.br')
      marcus.setPassword('Skip@Pass')
      marcus.setVerified(true)
      marcus.set('name', 'Marcus Godoy')
      marcus.set('role', 'admin')
      marcus.set('is_admin', true)
      marcus.set('company', company.id)
      app.save(marcus)
    }
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'marcus@godoyprime.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
