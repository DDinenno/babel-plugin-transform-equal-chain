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

  const buildNode = (path, exp) => {
    return t.binaryExpression(path.node.operator, path.node.left, exp);
  };

  const buildLogicalChain = (path, expressions) => {
    if (expressions.length === 0) return [];

    if (expressions.length === 1) {
      if (expressions[0].type === "BinaryExpression") {
        return buildNode(path, expressions[0]);
      }
      return expressions[0];
    }

    const left = buildNode(path, expressions[0]);
    const right = buildLogicalChain(path, expressions.slice(1));

    return t.logicalExpression("||", left, right);
  };

  return {
    name: "ast-transform",
    visitor: {
      BinaryExpression: (path) => {
        if (path.node.operator === "==" || path.node.operator === "===") {
          if (path.node.right.type === "LogicalExpression") {
            const expressions = recursivelyFind(path.node.right);

            if (expressions.length === 2) {
              path.replaceWith(
                t.logicalExpression(
                  "||",
                  buildNode(path, expressions[0]),
                  buildNode(path, expressions[1])
                )
              );
            } else if (expressions.length > 2) {
              path.replaceWith(buildLogicalChain(path, expressions));
            }
          }
        }
      },
    },
  };
};
