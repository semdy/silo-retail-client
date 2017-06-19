/**
 * Created by mcake on 2017/6/19.
 */

let strategies = {
  required: function(value, errorMsg){ //非空验证
    if( value === '' ){
      return errorMsg;
    }
  },
  minlength: function(value, length, errorMsg){ //限制最小长度
    if(value.length < length){
      return errorMsg;
    }
  },
  maxlength: function(value, length, errorMsg) { //限制最大长度
    if (value.length > length) {
      return errorMsg;
    }
  },
  ismobile: function(value, errorMsg){ //手机号验证
    if( !/^1[35789]\d{9}$/.test(value) ){
      return errorMsg;
    }
  },
  ispwd: function(value, errorMsg){ //密码验证(新密码必须是6-30位字符，可使用字母、数字、下划线)
    if( !/^[A-Za-z0-9_]{6,30}$/.test(value) ){
      return errorMsg;
    }
  },
  equalTo: function(value, equalName, errorMsg){  //等值验证
    if( value !== this.form[equalName].value ){
      return errorMsg;
    }
  }
};

class Validator {
  constructor(form){
    this.form = form;
    this.cache = []; //保存校验规则
  }

  add(vNode, rules){
    let self = this;

    if( !vNode ) return;

    if( {}.toString.call(rules) === '[object Object]' ){
      rules = [rules];
    }

    for(let i=0, rule; rule = rules[i++];){
      (function(rule){
        let strategyAry = rule.method.split(':');
        let errorMsg = rule.errorMsg;

        self.cache.push(function(){
          let strategy = strategyAry.shift();
          strategyAry.unshift(vNode.value);
          strategyAry.push(errorMsg);

          let msg = strategies[strategy].apply(vNode, strategyAry);
          if( msg ){
            vNode.handleError.call(vNode, msg);
          }

          return msg;
        });
      })(rule);
    }
  }

  validate(){
    for(let i = 0, validateFunc; validateFunc = this.cache[i++];){
      let msg = validateFunc();
      if(msg){
        return msg;
      }
    }
  }
}

Validator.addMethod = function(){
  let args = arguments;
  if( typeof args[0] === 'string' ){
    strategies[args[0]] = args[1];
  }
  else if( typeof args[0] === 'object' ){
    for(let i in args[0]){
      strategies[i] = args[0][i];
    }
  }

  return strategies;
};

Validator.parse = function(form, cb){

  let validateHandler = function(){
    //创建一个Validator对象并获得校验结果
    let errorMsg = new Validator(form).validate();
    //返回校验结果
    return errorMsg;
  };

  form.addEventListener('submit',function(e){
    let errorMsg = validateHandler();
    if ( errorMsg ) {
      return e.preventDefault();
    }
    cb && cb.call(form, e);
  }, false);

};

export default Validator;