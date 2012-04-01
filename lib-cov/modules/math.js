/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['modules/math.js']) {
  _$jscoverage['modules/math.js'] = [];
  _$jscoverage['modules/math.js'][54] = 0;
  _$jscoverage['modules/math.js'][56] = 0;
  _$jscoverage['modules/math.js'][58] = 0;
  _$jscoverage['modules/math.js'][60] = 0;
  _$jscoverage['modules/math.js'][61] = 0;
  _$jscoverage['modules/math.js'][65] = 0;
  _$jscoverage['modules/math.js'][66] = 0;
  _$jscoverage['modules/math.js'][70] = 0;
  _$jscoverage['modules/math.js'][71] = 0;
  _$jscoverage['modules/math.js'][75] = 0;
  _$jscoverage['modules/math.js'][76] = 0;
  _$jscoverage['modules/math.js'][82] = 0;
  _$jscoverage['modules/math.js'][87] = 0;
  _$jscoverage['modules/math.js'][88] = 0;
}
_$jscoverage['modules/math.js'][54]++;
(function (plastic) {
  _$jscoverage['modules/math.js'][56]++;
  function plasticModule() {
    _$jscoverage['modules/math.js'][58]++;
    var functions = {"minus": (function (numbers, amount) {
  _$jscoverage['modules/math.js'][60]++;
  return this.loop((function (number) {
  _$jscoverage['modules/math.js'][61]++;
  return number - amount;
}));
}), "plus": (function (numbers, amount) {
  _$jscoverage['modules/math.js'][65]++;
  return this.loop((function (number) {
  _$jscoverage['modules/math.js'][66]++;
  return number + amount;
}));
}), "multipliedBy": (function (numbers, amount) {
  _$jscoverage['modules/math.js'][70]++;
  return this.loop((function (number) {
  _$jscoverage['modules/math.js'][71]++;
  return number * amount;
}));
}), "dividedBy": (function (numbers, amount) {
  _$jscoverage['modules/math.js'][75]++;
  return this.loop((function (number) {
  _$jscoverage['modules/math.js'][76]++;
  return number / amount;
}));
})};
    _$jscoverage['modules/math.js'][82]++;
    this.use(functions);
}
  _$jscoverage['modules/math.js'][87]++;
  if (plastic) {
    _$jscoverage['modules/math.js'][87]++;
    plastic.modules.math = plasticModule;
  }
  _$jscoverage['modules/math.js'][88]++;
  if (module) {
    _$jscoverage['modules/math.js'][88]++;
    module.exports = plasticModule;
  }
})(this.plastic);
_$jscoverage['modules/math.js'].source = ["/*","","# plasticMath","","A fluent api for for basic mathematical operators based on plastic.js","","# Why?","","Why use long function chains for simple math operations? But before","yelling *madness* consider the two scenarios for which the library has been","created.","","First, it will be used to extend existing fluent apis with math functions. It makes sense to do","math with function if your already chaining methods. Ex.:","\tvar maxSizeInK = conf(\"maxSize\").dividedBy(1024).round();","","Second, we have a templating engine called \"Dali\" which will soon get a","rewrite. In its new version this templating engine will not allow the","embedding of javascript and only support the use of function calls instead of","full-fledge expressions.","","But wait, There is a third scenario which is not yet implemented. While","operations on simple number like \"3 + 5\" is easy to do with standard operators,","operation of arrays and matrices are really complexe. So, eventually this api","will support operations on more complexe structures. For example:","\tvar matrix = [6, 6, 4, 4, 5, 6];","\tmath(matrix).mod(","\t\tmath(matrix).average()","\t)","","# Usage","","Create an instance :","\tvar math = plasticMath();","","For this operation :","\tvar result = (4 * 3) / 6 - 1;","","Use a function chain like this:","\tvar result = math(4).multipliedBy(3).dividedBy(6).minus(1).val();","","","## Utility functions:","- .val(number) : Return the value of the first item in the context","- .take(number) : Use a new number for the current context","","## Math functions:","- .minus(number) : Calculate the context minus this number","- .plus(number) : Calculate the context plus this number","- .dividedBy(number) : Calculate the context divided by this number","- .multipliedBy(number) : Calculate the context multiplied by this number",""," */","(function (plastic) {","","\tfunction plasticModule() {","","\t\tvar functions = {","\t\t\t\"minus\": function (numbers, amount) {","\t\t\t\treturn this.loop(function (number) {","\t\t\t\t\treturn number - amount;","\t\t\t\t});","\t\t\t},","\t\t\t\"plus\": function (numbers, amount) {","\t\t\t\treturn this.loop(function (number) {","\t\t\t\t\treturn number + amount;","\t\t\t\t});","\t\t\t},","\t\t\t\"multipliedBy\": function (numbers, amount) {","\t\t\t\treturn this.loop(function (number) {","\t\t\t\t\treturn number * amount;","\t\t\t\t});","\t\t\t},","\t\t\t\"dividedBy\": function (numbers, amount) {","\t\t\t\treturn this.loop(function (number) {","\t\t\t\t\treturn number / amount;","\t\t\t\t});","\t\t\t}","\t\t};","","\t\t// Add the math functions","\t\tthis.use(functions);","","\t}","","\t// Export as either a global or a module","\tif (plastic) plastic.modules.math = plasticModule;","\tif (module) module.exports = plasticModule;","","})(this.plastic);",""];
