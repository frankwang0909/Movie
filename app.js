//入口文件
//
//加载express模块
var express = require('express');
//加载路径模块
var path = require('path');
//加载数据库模块
var mongoose = require('mongoose');
//加载movie模块
var Movies = require('./models/movie');
//加载underscore
var _ = require('underscore');
//加载body-parser
var bodyParser = require('body-parser');
// 端口
var port = process.env.PORT || 3000 ;
var app = express();

//连接本地数据库
mongoose.connect('mongodb://localhost/meimanhub');
//view层的目录
app.set('views', './views/pages');

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extend:true}));
// 设置静态资源的路径
app.use(express.static(path.join(__dirname, 'public')));

app.locals.moment = require('moment');
// 监听端口
app.listen(port);

console.log('meimanhub started on port' + port);

//设置路由
//index page
app.get('/', function(req, res) {
  Movies.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('index', {
      title: '电影网首页',
      movies: movies,
      //伪造数据，测试页面显示效果
      // movies: [
      // {
      //  title: '神盾局特工',
      //  _id: 1,
      //  poster: 'http://photocdn.sohu.com/20140923/vrsa_ver7040988_5rS49_pic26.jpg'

      //  },{
      //  title: '闪电侠',
      //  _id: 2,
      //  poster: 'http://puui.qpic.cn/vcover_vt_pic/0/slu2iapi5vnct1zt1458898229.jpg/220'
      //  },{
      //  title: '绿箭侠',
      //  _id: 3,
      //  poster: 'http://photocdn.sohu.com/20140925/vrsa_ver7041048_1H9UO_pic26.jpg'

      //  },{
      //  title: '明日传奇',
      //  _id: 4,
      //  poster: 'http://t2.baidu.com/it/u=1238982234,1788934720&fm=20'
      // }
      // ]
    });
  });
 
});

//detail page
app.get('/movie/:id', function(req, res) {
  var id = req.params.id;
  Movies.findById(id, function(err, movie) {
    res.render('detail', {
      title: '电影网 ' + movie.title,
      movie: movie
        
      // title: '电影网 详情页',
      // movie: {
      //  title:'神盾局特工',
      //  director: '乔斯·韦登',
      //  country: '美国',
      //  language:'英语',
      //  year:'2013',
      //  poster: 'http://photocdn.sohu.com/20140923/vrsa_ver7040988_5rS49_pic26.jpg',
      //  summary:'神盾局资深特工菲尔·科尔森从纽约大战归来，回到执法机构神盾局。他组织了一支精锐、训练有素的特工小组，处理那些还未被指定为机密的案件：那些新的、陌生的、未知的东西。这个小组包括：正直坦率的沃德探员（布雷特·道顿饰演），他是位作战和间谍活动的专家；梅探员（温明娜饰演）是位飞行员及武术专家；菲兹探员（伊恩·德·卡斯泰克饰演）是一位天才科学家，不过他在人际交往的能力则略显尴尬；西蒙斯探员（伊丽莎白·亨斯屈奇饰演），她对生物和化学很有一手；最后，便是神盾局召来的平民骇客斯凯（汪可盈饰演）。',
      //  flash:'http://static.video.qq.com/TPout.swf?vid=v0013wse8f3&auto=0',
      // }
    });
  });
});

//admin page
app.get('/admin/movie', function(req, res) {
  res.render('admin', {
    title: '电影网后台录入页',
    movie: {
      title:'',
      director: '',
      country: '',
      language:'',
      year:'',
      poster: '',
      summary:'',
      flash:'',
    }
  });
});

//admin upadate movie
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id;
  if(id){
    Movies.findById(id, function(err, movie) {
      res.render('admin',{
        title: '电影网 后台更新页',
        movie:movie
      });
    });
  }
});
//admin post movie 
app.post('/admin/movie/new', function(req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  if (id !== 'undefined') {//判断是否为新增数据
    Movies.findById(id, function(err, movie) {
      if (err) {
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
      _movie.save(function(err,movie) {
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/'+movie._id);
      });
    });
  }
  else{
    _movie = new Movies({
      director: movieObj.director,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash,
    });
    _movie.save(function(err,movie) {
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/'+movie._id);
      });
  }
});

//list page
app.get('/admin/list', function(req, res) {
  Movies.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('list', {
      title: '电影网 后台列表页',
      movies: movies
      // movies: [{
      //   title:'神盾局特工',
      //   _id: 1,
      //   director: '乔斯·韦登',
      //   country: '美国',
      //   language:'英语',
      //   flash:'http://static.video.qq.com/TPout.swf?vid=v0013wse8f3&auto=0',
      // }]
    });
  });
});

//list delete movie
app.delete('/admin/list', function(req, res) {
  var id = req.query.id;
  if(id){
    Movies.remove(id, function(err, movie ) {
      if (err) {
        console.log(err);
      }
      else{
        res.json({success:1});
      }
    });
  }

});