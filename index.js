"use strict";

exports.__esModule = true;

exports.default = function (babel) {
  const { types: t } = babel;

  const recursivelyFind = (node) => {
    let expressions = [];

    if (node.operator === "||") {
      if (node.left.type === "LogicalExpression") {
        expressions.push(...recursivelyFind(node.left));
      } else {
        expressions.push(node.left);
      }

      if (node.right.type === "LogicalExpression") {
        expressions.push(...recursivelyFind(node.right));
      } else {
        expressions.push(node.right);
      }
    } else {
      expressions.push(node);
    }

    return expressions;
  };

  const buildEqualityExp = (path, exp) => {
    return t.binaryExpression(path.node.operator, path.node.left, exp);
  };

  const buildLogicalChain = (path, expressions) => {
    if (expressions.length === 0) return [];

    if (expressions.length === 1) {
      if (expressions[0].type === "BinaryExpression") {
        return buildEqualityExp(path, expressions[0]);
      }
      return buildEqualityExp(path, expressions[0]);
    }

    const left = buildEqualityExp(path, expressions[0]);
    const right = buildLogicalChain(path, expressions.slice(1));

    return t.logicalExpression("||", left, right);
  };

  return {
    name: "transform-equal-chain",
    visitor: {
      BinaryExpression: (path) => {
        if (["==", "==="].includes(path.node.operator)) {
          if (path.node.right.type === "LogicalExpression") {
            const expressions = recursivelyFind(path.node.right);

            if (expressions.length > 1) {   
              path.replaceWith(buildLogicalChain(path, expressions));
            }
          }
        }
      },
    },
  };
};
