migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'marcus@godoyprime.com.br')
      record.set('role', 'admin')
      record.set('is_admin', true)
      app.save(record)
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('marcus@godoyprime.com.br')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Marcus Godoy')
    record.set('role', 'admin')
    record.set('is_admin', true)
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'marcus@godoyprime.com.br')
      record.set('role', '')
      record.set('is_admin', false)
      app.save(record)
    } catch (_) {}
  },
)
