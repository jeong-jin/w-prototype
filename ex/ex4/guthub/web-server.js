var express = require('express'),
  app     = express(),
  port    = parseInt(process.env.PORT, 10) || 8080;

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/app'));
  app.use(app.router);
});

var recipes_map = {
  '1': {
    'id': '1',
    'title': '쿠키',
    'description': '쫄깃함과 바삭함이 살아있는 감미로운 초콜릿 쿠키!\n최고급 쿠기를 만들어봐요.',
    'ingredients': [ { 'ingredientName': '초코칩쿠키', 'amount': '1', 'amountUnits': '상자' } ],
    'instructions': '1. 초코칩쿠키를 한 봉지 사옵니다.\n2. 오븐에 넣고 1분간 데웁니다.\n3. 오븐에서 갓 꺼낸 따뜻한 쿠키를 맛보세요.\n4. 쿠키를 직접 구울 줄 알았다면 딴 데 가서 알아보세요.'
  },
  '2': {
    'id': '2',
    'title': '계란과자',
    'description': '촉촉하고 부드럽고 고소한 계란과자!\n부담 없는 계란과자를 직접 만들어봐요.',
    'ingredients': [ { 'ingredientName': '진짜 계란과자', 'amount' : '13', 'amountUnits': '봉지' } ],
    'instructions': '1. 계란 하나를 그릇에 넣고 잘 저어서 풀어줍니다.\n2. 집에 사놓았던 과자를 뜯어서 방금 푼 계란물에 찍어 먹습니다.'
  }
};
var next_id = 3;

app.get('/recipes', function(req, res) {
  var recipes = [];

  for (var key in recipes_map) {
    recipes.push(recipes_map[key]);
  }

  // 서버의 지연을 흉내 냄
/*  setTimeout(function() {  // setTimeout 함수는 여기서 인식되지 않으므로 원서의 코드를 주석 처리함 */
    res.send(recipes);
/*  }, 500);*/
});

app.get('/recipes/:id', function(req, res) {
  console.log('다음 id로 레시피를 요청 중: ', req.params.id);
  res.send(recipes_map[req.params.id]);
});

app.post('/recipes', function(req, res) {
  var recipe = {};
  recipe.id = next_id++;
  recipe.title = req.body.title;
  recipe.description = req.body.description;
  recipe.ingredients = req.body.ingredients;
  recipe.instructions = req.body.instructions;

  recipes_map[recipe.id] = recipe;

  res.send(recipe);
});

app.post('/recipes/:id', function(req, res) {
  var recipe = {};
  recipe.id = req.params.id;
  recipe.title = req.body.title;
  recipe.description = req.body.description;
  recipe.ingredients = req.body.ingredients;
  recipe.instructions = req.body.instructions;

  recipes_map[recipe.id] = recipe;

  res.send(recipe);
});

app.listen(port);
console.log('이제 애플리케이션이 제공되는 서버는 http://localhost:' + port + '/ 입니다.');
