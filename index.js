const template = require('babel-template');
const t = require('@babel/types');

module.exports = function (babel) {
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

        const filename = state?.file?.opts?.filename ?? '';
        if (filename.includes('taro-renderor/src/pages/mock')) {
          replaceScriptStr(node, 'input');
          replaceScriptStr(node, 'output');
        }
      },
    },
  };
};
