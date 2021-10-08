const express = require("express");
const axios = require('axios')
const app = express()
const mysql = require('mysql')
const cors = require('cors');
const { json } = require("express");
//必须要用这两个才能用req.body
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

//连接数据库参数配置
var connection = mysql.createConnection({
    host: "localhost", //主机
    port: '3306',	//端口
    user: "root",	//用户名
    password: "196128",	//密码
    database: "myuncle"		//数据库
});
//连接mysql
connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log('connect mysql success');
});

function Myquery(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    })

}
// 允许跨域请求
app.use(cors())
// 添加
app.post('/Additem', async (req, res) => {
    let { name, quantity, price } = req.body.add_to
    let sql = `insert into commodity(name,quantity,price)value('${name}','${quantity}','${price}')`
    let result = await Myquery(sql)
    if (result.affectedRows) {
        res.json({ code: 10002, message: "添加成功" })
    } else {
        res.json({ code: 10003, message: "添加失败" })
    }
})

//删除
app.post('/EliminateData', async (req, res) => {
    let { id } = req.body
    let sql = `delete  from commodity where id=${id}`
    let result = await Myquery(sql)
    if (result.affectedRows) {
        res.json({ code: 10004, message: '删除成功' })
    } else {
        res.json({ code: 10005, message: '删除失败' })
    }
})
//编辑
app.post('/editCate', async (req, res) => {
    let { name, quantity, price, id } = req.body.listAdd
    console.log(name, quantity, price);
    console.log(req.body);
    let sql = `update commodity set name='${name}',quantity='${quantity}',price=${price} where id=${id}`
    let result = await Myquery(sql)
    if (result.affectedRows) {
        res.json({ code: 10006, message: '添加成功' })
    } else {
        res.json({ code: 10007, message: '编辑失败' })
    }
})
//所用列表信息
app.get('/index', async (req, res) => {
    let sql = `select * from commodity`
    let result = await Myquery(sql)
    res.json(result)
})


app.listen(5000, () => {
    console.log('Server connection succeeded');
})