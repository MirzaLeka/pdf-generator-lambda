const url = 'https://jv2cjzphja.execute-api.eu-central-1.amazonaws.com/generate-PDF-Prod'
const body = { body: 'JS' }

fetch(url, {
  mode: 'no-cors',
  method: 'POST',
  headers: {
    accept: 'application.json',
    'Content-Type': 'application/json'
  },
  body,
  cache: 'default'
})
.then(res => res.json())
.then((data) => {
  console.log('all went well')
  console.log(data)
})
.catch(e => {
  console.log('error ocurred')
  console.log(e.message)
})