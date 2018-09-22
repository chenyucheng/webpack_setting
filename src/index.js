let str = require('./a.js')

import './index.css'
import './style.less'

document.getElementById("app").innerHTML = str

if (module.hot) {
    console.log('accept2')
    module.hot.accept()
}