const express = require('express')
const url = require('url')
const app = express()
const querystring = require("querystring")
const connection = require('./db') // 获取连接实例
const { port } = require('./config') // 获取启动参数
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var cors = require("cors");
const { count } = require('console')
app.use(cors({
  methods: ["GET", "POST"],
  alloweHeaders: ["Content-Type", "application/json;charset=utf-8;application"]
}))
//登录接口
app.get('/api/user/login', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  console.log(req.query.username)
  console.log(req.query.password)
  const sql = `select * from testerinfo where tester_username='${req.query.username}'`
  connection.query(sql, (err, result) => {
    if (result.length == '0') {
      res.json({
        "meta": {
          "status": "500",
          "msg": "登录失败"
        },
        "data": result
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": "200",
          "msg": "登陆成功"
        },
        "data": result
      })
    }
  })
})
//注册接口
app.post('/api/user/register', (req, res, next) => {
  /* 使用 connection.query 来执行 sql 语句 */
  // 第一个参数为 sql 语句，可以透过 js 自由组合
  // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  let { username, password } = req.body
  const sqlstr = `insert into testerinfo(tester_username,tester_password) values('${username}','${password}')`;
  connection.query(sqlstr, (err, users) => {
    if (err) {
      res.json({
        "meta": {
          "status": 500,
          "msg": "已注册"
        }
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": 200,
          "msg": "注册成功"
        }
      })
    }
  })
})


//获取用户信息
app.get('/api/user/findAll', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  const sql = "select * from testerinfo"
  connection.query(sql, (err, result) => {
    if (result.length == '0') {
      res.json({
        "meta": {
          "status": "500",
          "msg": "登录失败"
        },
        "data": result
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": "200",
          "msg": "登陆成功"
        },
        "data": result
      })
    }
  })
})

//分页&用户列表接口
app.get('/api/user/page', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  const sql = "select * from testerinfo";
  connection.query(sql, (err, result) => {
    //当前页
    let curpage = Number(req.query.pagenum)
    //每页显示条数
    let pagesize = Number(req.query.pagesize)
    let sumpage = Math.ceil(result.length / pagesize)
    const total = result.length
    // 将 MySQL 查询结果作为路由返回值
    if (curpage == '') {
      //这里是前端未传参数默认返第一页数据
      let data = result.splice(0, pagesize)//利用数组方法截取数据
      res.send({
        sumpage: sumpage,
        status: 200,
        message: '获取用户基本信息成功！',
        data: data,
        total: total
      })
    }
    else {
      //这里是前端传参数返回的数据
      let data = result.splice((curpage - 1) * pagesize, pagesize)//利用数组方法截取数据
      res.send({
        sumpage: sumpage,
        status: 200,
        message: '获取用户基本信息成功！',
        data: data,
        total: total
      })
    }
  })
})

//添加用户信息接口
app.post('/api/user/insert', (req, res, next) => {
  /* 使用 connection.query 来执行 sql 语句 */
  // 第一个参数为 sql 语句，可以透过 js 自由组合
  // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  let { tester_name, tester_experience, tester_phone, tester_username, tester_password } = req.body
  const sqlstr = `insert into testerinfo(
    tester_name,
    tester_experience,
    tester_phone,
    tester_username,
    tester_password
    ) values('${tester_name}','${tester_experience}','${tester_phone}','${tester_username}','${tester_password}')`;
  connection.query(sqlstr, (err, users) => {
    if (err) {
      res.json({
        "meta": {
          "status": 500,
          "msg": "插入失败"
        }
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": 200,
          "msg": "添加成功"
        }
      })
    }
  })
})

//搜索用户
app.get('/api/user/search', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  var tester_id = Number(req.query.tester_id);

  const sql = `select * from testerinfo where tester_id='${tester_id}'`;
  connection.query(sql, (err, result) => {
    if (result.length == 0) {
      res.json({
        "meta": {
          "status": "500",
          "msg": "no data"
        },
        "data": result
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": "200",
          "msg": "搜索成功"
        },
        "data": result
      })
    }
  })
})

//修改用户信息
app.post('/api/user/update', (req, res, next) => {
  /* 使用 connection.query 来执行 sql 语句 */
  // 第一个参数为 sql 语句，可以透过 js 自由组合
  // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  let { tester_id, tester_name, tester_experience, tester_phone, tester_username, tester_password } = req.body
  const sqlstr = `update testerinfo 
  set tester_name='${tester_name}',
  tester_experience='${tester_experience}',
  tester_phone='${tester_phone}',
  tester_username='${tester_username}',
  tester_password='${tester_password}'
  where tester_id='${tester_id}'
  `;
  connection.query(sqlstr, (err, users) => {
    if (err) {
      res.json({
        "meta": {
          "status": 500,
          "msg": "修改失败"
        }
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": 200,
          "msg": "修改成功"
        }
      })
    }
  })
})

//根据id获取用户信息(修改用户)
app.get('/api/user', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  var tester_id = Number(req.query.tester_id);
  const sql = `select * from testerinfo where tester_id='${tester_id}'`;
  connection.query(sql, (err, result) => {
    if (result.length == 0) {
      res.json({
        "meta": {
          "status": "500",
          "msg": "no data"
        },
        "data": JSON.parse(JSON.stringify(result))
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": "200",
          "msg": "查找信息成功"
        },
        "data": result[0]
      })
    }
  })
})

//删除用户信息
app.get('/api/user/delete', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  var tester_id = Number(req.query.tester_id);
  console.log(tester_id)
  const sql = `delete from testerinfo where tester_id='${tester_id}'`;
  connection.query(sql, (err) => {
    if (err) {
      res.json({
        "meta": {
          "status": 500,
          "msg": "删除失败"
        }
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": 200,
          "msg": "删除成功"
        }
      })
    }
  })
})

//获取用例信息&分页列表
app.get('/api/case/page', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  const sql = "select * from caseinfo";
  connection.query(sql, (err, result) => {
    //当前页
    let curpage = Number(req.query.pagenum)
    //每页显示条数
    let pagesize = Number(req.query.pagesize)
    let sumpage = Math.ceil(result.length / pagesize)
    const total = result.length
    // 将 MySQL 查询结果作为路由返回值
    if (curpage == '') {
      //这里是前端未传参数默认返第一页数据
      let data = result.splice(0, pagesize)//利用数组方法截取数据
      res.send({
        sumpage: sumpage,
        status: 200,
        message: '获取用例基本信息成功！',
        data: data,
        total: total
      })
    }
    else {
      //这里是前端传参数返回的数据
      let data = result.splice((curpage - 1) * pagesize, pagesize)//利用数组方法截取数据
      res.send({
        sumpage: sumpage,
        status: 200,
        message: '获取用例基本信息成功！',
        data: data,
        total: total
      })
    }
  })
})

//根据id获取用例信息
app.get('/api/case', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  var case_id = Number(req.query.case_id);
  const sql = `select * from caseinfo where case_id='${case_id}'`;
  connection.query(sql, (err, result) => {
    if (result.length == 0) {
      res.json({
        "meta": {
          "status": "500",
          "msg": "no data"
        },
        "data": JSON.parse(JSON.stringify(result))
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": "200",
          "msg": "查找信息成功"
        },
        "data": result[0]
      })
    }
  })
})


//提交发布任务数据
app.post('/api/case/publish', (req, res, next) => {
  /* 使用 connection.query 来执行 sql 语句 */
  // 第一个参数为 sql 语句，可以透过 js 自由组合
  // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  var values = []
  var sql = "INSERT INTO testerinfo_caseinfo (case_id, tester_id) VALUES ?"
  var { case_id, idlist } = req.body
  for (let i = 0; i < idlist.length; i++) {
    values.push([case_id, idlist[i]])
  }
  connection.query(sql, [values], (err, result) => {
    if (err) {
      res.json({
        meta: {
          status: "500",
          msg: "插入失败",
          data: result
        }
      })
    }
    else {
      res.json({
        meta: {
          status: "200",
          msg: "插入成功",
          data: result
        }
      })
    }
  })
})

//查询测试人任务分配信息
app.get('/api/testerinfo_caseinfo', (req, res) => {
  var case_id = req.query.case_id
  const sql = `select 
  testerinfo_caseinfo.case_id,
	testerinfo_caseinfo.tester_id  
  from testerinfo_caseinfo,caseinfo 
  where testerinfo_caseinfo.case_id='${case_id}' 
  and caseinfo.case_id=testerinfo_caseinfo.case_id`
  connection.query(sql, (err, result) => {
    if (result.length == 0) {
      res.json({
        meta: {
          status: "500",
          msg: "查询失败"
        },
        data: result
      })
    }
    else {
      res.json({
        meta: {
          status: "200",
          msg: "查询成功",
        },
        data: result
      })
    }
  })
})

//获取任务列表
app.get('/api/taskList/page', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  var tester_id = req.query.tester_id
  const sql = `SELECT
	testerinfo.tester_id,
	testerinfo.tester_name,
	caseinfo.case_description,
	caseinfo.case_id,
	caseinfo.case_createTime,
	caseinfo.case_state
	FROM
	caseinfo,
	testerinfo,
	testerinfo_caseinfo
WHERE
	testerinfo.tester_id = testerinfo_caseinfo.tester_id
	AND 
	testerinfo.tester_id='${tester_id}'
	AND caseinfo.case_id = testerinfo_caseinfo.case_id`;
  connection.query(sql, (err, result) => {
    //当前页
    let curpage = Number(req.query.pagenum)
    //每页显示条数
    let pagesize = Number(req.query.pagesize)
    let sumpage = Math.ceil(result.length / pagesize)
    const total = result.length
    // 将 MySQL 查询结果作为路由返回值
    if (curpage == '') {
      //这里是前端未传参数默认返第一页数据
      let data = result.splice(0, pagesize)//利用数组方法截取数据
      res.send({
        sumpage: sumpage,
        status: 200,
        message: '获取任务列表成功！',
        data: data,
        total: total
      })
    }
    else {
      //这里是前端传参数返回的数据
      let data = result.splice((curpage - 1) * pagesize, pagesize)//利用数组方法截取数据
      res.send({
        sumpage: sumpage,
        status: 200,
        message: '获取任务列表信息成功！',
        data: data,
        total: total
      })
    }
  })
})

//提交任务
app.get('/api/taskList/submit', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  var case_id = req.query.case_id
  const sql = `update caseinfo set case_state="已完成" where case_id='${case_id}'`;
  connection.query(sql, (err, result) => {
    if(err){
      throw err
    }else{
      res.json({
        meta:{
          status:200,
          msg:"任务提交成功已结束"
        }
      })
    }
  })
})

//新增用例
app.post('/api/caseinfo/insert', (req, res, next) => {
  /* 使用 connection.query 来执行 sql 语句 */
  // 第一个参数为 sql 语句，可以透过 js 自由组合
  // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  let {case_description} = req.body
  const sqlstr = `insert into caseinfo(case_description) values('${case_description}')`;
  connection.query(sqlstr, (err, users) => {
    if (err) {
      res.json({
        "meta": {
          "status": 500,
          "msg": "插入失败"
        }
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": 200,
          "msg": "添加成功"
        }
      })
    }
  })
})

app.get('/api/caseinfo/delete', (req, res, next) => {
  // /* 使用 connection.query 来执行 sql 语句 
  // // 第一个参数为 sql 语句，可以透过 js 自由组合
  // // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  var case_id = Number(req.query.case_id);
  console.log(case_id)
  const sql = `delete from caseinfo where case_id='${case_id}'`;
  connection.query(sql, (err) => {
    if (err) {
      res.json({
        "meta": {
          "status": 500,
          "msg": "删除失败"
        }
      })
    } else {
      // 将 MySQL 查询结果作为路由返回值
      res.json({
        "meta": {
          "status": 200,
          "msg": "删除成功"
        }
      })
    }
  })
})


app.listen(port, () => {
  console.log(`express server listen at http://localhost:${port}`)
})
