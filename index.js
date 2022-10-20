const template = require('babel-template');

module.exports = function (babel) {
  let t = babel.type;

  const fn = template(`function FUNCNAME(data){FUNCBODY}`);

  function replaceScriptStr(node, funcName) {
    const inputObjectProperty = node.properties.find(
      (n) => n.key.name === funcName
    );
    if (inputObjectProperty) {
      const inputFuncBodyStr = inputObjectProperty.value.value;

      const funcAst = fn({
        FUNCNAME: t.Identifier(funcName),
        FUNCBODY: t.Identifier(inputFuncBodyStr),
      });
      inputObjectProperty.value = funcAst;
    }
  }

  return {
    name: 'babel-plugin-gizwits-preval',
    visitor: {
      ObjectExpression: (path, state) => {
        let node = path.node;
        replaceScriptStr(node, 'input');
        replaceScriptStr(node, 'output');
      },
    },
  };
};
