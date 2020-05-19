var logo = require('./logo.js');
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var shortid=require('js-shortid');
var session = require('express-session');
var open = require('open');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(multer({ dest: path.join(__dirname, './public/upload/') }).any());
app.use(session({secret:shortid.gen(),resave : true,saveUninitialized: false,cookie : {maxAge : 1000 * 60 * 10}}));

//加载用logo写的部分hairserver的代码

//用户自定义的web工程init代码

app.get('/login', function (req, res){
	var file = fs.readFileSync("template/login.lgo","utf8");
	var compiler=file.match(/\<\%(.|\n)*?\%\>/g);if(compiler){var loopArray=function e(r){logo.run(resCom+compiler[r].replace(/(^\<\%)|(\%\>$)/g,"")+'$ "').catch(function(o){file=file.replace(compiler[r],o.output),r++,r==len?logo.run("op :"+sid+"_cookie").catch(function(e){e.output.map(function(e,r,o){for(var i=e[2],s={},n=0;n<i.length;n+=2)s[i[n]]=i[n+1];res.cookie(e[0],e[1],s)}),logo.run("op :"+sid+"_clearcookie").catch(function(e){e.output.map(function(e,r,o){for(var i=e[1],s={},n=0;n<i.length;n+=2)s[i[n]]=i[n+1];res.clearCookie(e[0],s)}),logo.run("op :"+sid+"_session").catch(function(e){e.output.map(function(e,r,o){req.session[e[0]]=e[1]}),logo.run(eraCom),res.send(file)})})}):e(r)})},len=compiler.length,reqCom="",resCom="",eraCom="",sid=shortid.gen();reqCom+="to server.in.ip"+sid+' op "'+req.ip+" end ",resCom+='copydef "server.in.ip "server.in.ip'+sid+' copydef "$ip "server.in.ip ',eraCom+='erase "server.in.ip'+sid,reqCom+="to server.in.header"+sid+" :x ";for(i in req.headers)reqCom+='if :x="'+i+' [op "'+req.headers[i].replace(/\s|;/g,"")+" ] ";reqCom+='op " end ',resCom+='copydef "server.in.header "server.in.header'+sid+' copydef "$header "server.in.header ',eraCom+=' erase "server.in.header'+sid,reqCom+="to server.in.cookie"+sid+" :x ";for(i in req.cookies)reqCom+='if :x="'+i+' [op "'+req.cookies[i]+" ] ";reqCom+='op " end ',resCom+='copydef "server.in.cookie "server.in.cookie'+sid+' copydef "$cookie "server.in.cookie ',eraCom+=' erase "server.in.cookie'+sid,reqCom+="to server.in.query"+sid+" :x ";for(i in req.query)reqCom+='if :x="'+i+' [op "'+req.query[i]+" ] ";reqCom+='op " end ',resCom+='copydef "server.in.query "server.in.query'+sid+' copydef "$query "server.in.query ',eraCom+=' erase "server.in.query'+sid,reqCom+="to server.in.param"+sid+" :x ";for(i in req.params)reqCom+='if :x="'+i+' [op "'+req.params[i]+" ] ";reqCom+='op " end ',resCom+='copydef "server.in.param "server.in.param'+sid+' copydef "$param "server.in.param ',eraCom+=' erase "server.in.param'+sid,reqCom+="to server.in.body"+sid+" :x ";for(i in req.body)reqCom+='if :x="'+i+' [op "'+req.body[i]+" ] ";reqCom+='op " end ',resCom+='copydef "server.in.body "server.in.body'+sid+' copydef "$body "server.in.body ',eraCom+=' erase "server.in.body'+sid,reqCom+="to server.in.file"+sid+" :x ",req.files&&req.files.forEach(function(e,r,o){reqCom+='if :x="'+e.fieldname+' [op "'+e.path+" ] "}),reqCom+='op " end ',resCom+='copydef "server.in.file "server.in.file'+sid+' copydef "$file "server.in.file ',eraCom+=' erase "server.in.file'+sid,reqCom+="to server.in.session"+sid+" :x ";for(i in req.session)reqCom+='if :x="'+i+' [op "'+req.session[i]+" ] ";reqCom+='op " end ',resCom+='copydef "server.in.session "server.in.session'+sid+' copydef "$session "server.in.session ',eraCom+=' erase "server.in.session'+sid,reqCom+='make "'+sid+"_session [] ",reqCom+="to server.out.session"+sid+' :x :y queue "'+sid+"_session list :x :y end ",resCom+='copydef "server.out.session "server.out.session'+sid+' copydef "$session.val "server.out.session ',eraCom+=' erase "server.out.session'+sid,eraCom+=' ern "'+sid+"_session",reqCom+='make "'+sid+"_cookie [] ",reqCom+="to server.out.cookie"+sid+' :x :y [:z []] queue "'+sid+"_cookie (list :x :y :z) end ",resCom+='copydef "server.out.cookie "server.out.cookie'+sid+' copydef "$cookie.val "server.out.cookie ',eraCom+=' erase "server.out.cookie'+sid,eraCom+=' ern "'+sid+"_cookie",reqCom+='make "'+sid+"_clearcookie [] ",reqCom+="to server.out.clearcookie"+sid+' :x [:z []] queue "'+sid+"_clearcookie list :x :z end ",resCom+='copydef "server.out.clearcookie "server.out.clearcookie'+sid+' copydef "$clearcookie.val "server.out.clearcookie ',eraCom+=' erase "server.out.clearcookie'+sid,eraCom+=' ern "'+sid+"_clearcookie",logo.run(reqCom).then(function(){loopArray(0)})}else res.send(file);
})
app.get('/', function (req, res) {
  var file = fs.readFileSync("template/index.lgo","utf8");
  var compiler = file.match(/\<\%(.|\n)*?\%\>/g);
  if (compiler) {
	  var len=compiler.length;
	  function loopArray(j){
		logo.run(resCom+compiler[j].replace(/(^\<\%)|(\%\>$)/g,"")+'$ "').catch((err)=>{
			//console.log("编号："+j+" logo语句："+compiler[j]+" 计算结果："+err.output);
	  		file = file.replace(compiler[j],err.output);
			j++;
			if(j==len){
				//将logo处理过的数据传给express的res
				//res.cookie "c "c1  
				logo.run('op :'+sid+'_cookie').catch((err)=>{
					err.output.map((item,index,array)=>{
						var p=item[2];
						var json={};
						for (var q=0;q<p.length;q=q+2){
							json[p[q]]=p[q+1];	
						}
						res.cookie(item[0],item[1],json);
					});
					//res.clearCookie
					logo.run('op :'+sid+'_clearcookie').catch((err)=>{
						err.output.map((item,index,array)=>{
							var p=item[1];
							var json={};
							for (var q=0;q<p.length;q=q+2){
								json[p[q]]=p[q+1];	
							}
							res.clearCookie(item[0],json);
						});
						logo.run('op :'+sid+'_session').catch((err)=>{
							err.output.map((item,index,array)=>{
								req.session[item[0]]=item[1];
							});
							//清理用到的临时过程和变量
							logo.run(eraCom);
							//res.json res.jsonp res.redirect 这些好像不能放在目前的链条上
							res.send(file);
						});				
					});
				});
			}else{
				loopArray(j);
			}
	  	});
	  }
	//将express提供的req对象传给logo;生成唯一短id来防止并发冲突。
	var reqCom = "";
	var resCom = "";
	var eraCom = "";
	var sid = shortid.gen();
	//1.req.ip == server.in.ip == $ip
	reqCom += 'to server.in.ip' + sid + ' op "' + req.ip + ' end ';
	resCom += 'copydef "server.in.ip "server.in.ip' + sid + ' copydef "$ip "server.in.ip ';
	eraCom += 'erase "server.in.ip' + sid;
	//2.req.get('Content-Type') == server.in.header "Content-Type == $header "Content-Type 
	reqCom += 'to server.in.header' + sid + ' :x ';
	for (i in req.headers) {
		reqCom += 'if :x="' + i +' [op "'+req.headers[i].replace(/\s|;/g,"")+' ] ';
	}
	reqCom += 'op " end ';
	resCom += 'copydef "server.in.header "server.in.header' + sid + ' copydef "$header "server.in.header ';
	eraCom += ' erase "server.in.header' + sid;
	//3.req.cookies xxx == server.in.cookie xxx == $cookie xxx
	reqCom += 'to server.in.cookie' + sid + ' :x ';
	for (i in req.cookies) {
		reqCom += 'if :x="' + i +' [op "'+req.cookies[i]+' ] ';
	}
	reqCom += 'op " end ';
	resCom += 'copydef "server.in.cookie "server.in.cookie' + sid + ' copydef "$cookie "server.in.cookie ';
	eraCom += ' erase "server.in.cookie' + sid;
	//4.req.query.xxx == server.in.query xxx == $query xxx
	reqCom += 'to server.in.query' + sid + ' :x ';
	for (i in req.query) {
		reqCom += 'if :x="' + i +' [op "'+req.query[i]+' ] ';
	}
	reqCom += 'op " end ';
	resCom += 'copydef "server.in.query "server.in.query' + sid + ' copydef "$query "server.in.query ';
	eraCom += ' erase "server.in.query' + sid;
	//5.req.params xxx == server.in.param xxx == $param xxx
	reqCom += 'to server.in.param' + sid + ' :x ';
	for (i in req.params) {
		reqCom += 'if :x="' + i +' [op "'+req.params[i]+' ] ';
	}
	reqCom += 'op " end ';
	resCom += 'copydef "server.in.param "server.in.param' + sid + ' copydef "$param "server.in.param ';
	eraCom += ' erase "server.in.param' + sid;
	//6.req.body
	reqCom += 'to server.in.body' + sid + ' :x ';
	for (i in req.body) {
		reqCom += 'if :x="' + i +' [op "'+req.body[i]+' ] ';
	}
	reqCom += 'op " end ';
	resCom += 'copydef "server.in.body "server.in.body' + sid + ' copydef "$body "server.in.body ';
	eraCom += ' erase "server.in.body' + sid;
	//7.req.files
	reqCom += 'to server.in.file' + sid + ' :x ';
	if (req.files) {
		req.files.forEach((item,index,array)=>{
			reqCom += 'if :x="' + item.fieldname +' [op "'+item.path+' ] ';
		});
	}
	reqCom += 'op " end ';
	resCom += 'copydef "server.in.file "server.in.file' + sid + ' copydef "$file "server.in.file ';
	eraCom += ' erase "server.in.file' + sid;
	//通过提供在解析hair文件前产生变量承接cookie和session的变更
	//8.session获取
	reqCom += 'to server.in.session' + sid + ' :x ';
	for (i in req.session) {
			reqCom += 'if :x="' + i +' [op "'+req.session[i]+' ] ';
	}
	reqCom += 'op " end ';
	resCom += 'copydef "server.in.session "server.in.session' + sid + ' copydef "$session "server.in.session ';
	eraCom += ' erase "server.in.session' + sid;
	//写session
	reqCom += 'make "' + sid + '_session [] ';
	reqCom += 'to server.out.session' + sid + ' :x :y queue "' + sid + '_session list :x :y end ';
	resCom += 'copydef "server.out.session "server.out.session' + sid + ' copydef "$session.val "server.out.session ';
	eraCom += ' erase "server.out.session' + sid;
	eraCom += ' ern "' + sid + '_session';
	//9.cookie
	reqCom += 'make "' + sid + '_cookie [] ';
	reqCom += 'to server.out.cookie' + sid + ' :x :y [:z []] queue "' + sid + '_cookie (list :x :y :z) end ';
	resCom += 'copydef "server.out.cookie "server.out.cookie' + sid + ' copydef "$cookie.val "server.out.cookie ';
	eraCom += ' erase "server.out.cookie' + sid;
	eraCom += ' ern "' + sid + '_cookie';
	//10.clearCookie
	reqCom += 'make "' + sid + '_clearcookie [] ';
	reqCom += 'to server.out.clearcookie' + sid + ' :x [:z []] queue "' + sid + '_clearcookie list :x :z end ';
	resCom += 'copydef "server.out.clearcookie "server.out.clearcookie' + sid + ' copydef "$clearcookie.val "server.out.clearcookie ';
	eraCom += ' erase "server.out.clearcookie' + sid;
	eraCom += ' ern "' + sid + '_clearcookie';

	logo.run(reqCom).then(()=>{
		loopArray(0);
	});
  }else{
  	res.send(file);
  }
});


app.listen(3000);
console.log("Server start success. Please visit http://localhost:3000");
open("http://localhost:3000");