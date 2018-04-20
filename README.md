# wxapp-emoji

自定义表情在小程序中的实现

- 首先需要定义表情的表示方式，然后以此组装出信息的字符串
- 然后显示的关键是实现一个字符串转数组的函数
- 此函数的关键是，根据表情的表示方式，写一个匹配正则表达式

## 定义表情的表示方式

使得表情与普通文字区分开

比如用中括号`[*]`标识

```js
'[微笑]'
'[撇嘴]'
```

当然也可用其他的方式，只是后面的正则写法会不一样

## 实现一个正则

需要实现的规则是：

> `[`开头，`]`结尾，中间包含一个字符以上，但中间不能包含`[`或`]`

我的蹩脚正则知识写出的正则表达式如下：

```sh
           +---+-+----+------>转义字符
           |   | |    |
const r = /\[[^\[\]]+?\]/g;
            | |     |  | |
            | |     |  | +--->`g`修饰符，表示可以多次匹配
            | |     |  +----->匹配`]`结尾
            | |     +-------->`+?`表示匹配一个或多个字符，且非贪婪模式
            | +-------------->`^`方括号内脱字符，表示不能包含`[`或`]`
            +---------------->匹配`[`开头
```

## 实现一个函数

把类似

```js
'你好[微笑]'
```

的字符串转化为一个如下数组，然后就很方便循环显示出文字或图片

```js
[
  {
    msgType: 'text',
    msgCont: '你好'
  },
  { msgType: 'emoji',
    msgCont: '[微笑]',
    msgImage: '/images/emojis/100.gif'
  }
]
```

我最开始实现的方法是这样的

> 原理是利用正则实例对象的`exec`方法
> 循环调用，然后将文字或表情信息组装到数组a

```js
const textToEmoji = (s) => {
  // 定义正则对象
  const r = /\[[^\[\]]+?\]/g;

  const a = []; // 定义返回的数组
  let t = null; // 是否匹配到表情符号
  let i = 0; // 下次匹配的序号

  while (true) {
    // 正则实例对象的exec方法，用来返回匹配结果。
    // 如果发现匹配，就返回一个数组，成员是匹配成功的子字符串，否则返回null。
    t = r.exec(s);

    if (!t) {
      // 如果匹配不成功，
      // 且序号i至结尾字符不为空，为空则忽略
      // 添加文字类型到数组a，并退出循环
      s.slice(i) && a.push({
        msgType: 'text',
        msgCont: s.slice(i)
      });
      break; // 退出循环
    }

    // 匹配到了，
    // 且 本次匹配的起始序号 与 表情符号第一个字符序号不等
    // 如果相等，则说明表情前面是一个空字符串，需要忽略
    (i !== t.index) && a.push({
      msgType: 'text',
      msgCont: s.slice(i, t.index)
    });

    // 匹配了类似[*]的表情符号
    // 还需要判断是否定义了此表情的图片
    if (emojis[t[0]]) {
      // 定义了表情图片，添加表情类型到数组a
      a.push({
        msgType: 'emoji',
        msgCont: t[0],
        msgImage: emojiToPath(t[0])
      });
    } else {
      // 此表情没有图片与之对应，当做文字类型添加到数组a
      a.push({
        msgType: 'text',
        msgCont: t[0]
      });
    }

    i = t.index + t[0].length; // 更新下一次匹配开始的序号
  }

  return a;
}
```

后来觉得理解上比较绕，又实现了另一个：

> 原理是利用字符串对象的`split`方法及`match`方法，
> 将两个返回组数轮流组装到数组a

```js
// 将聊天内容转为一个文字和图片混合的列表
// 另一个更容易理解的方法
const textToEmoji2 = (s) => {
  // 定义正则对象
  const r = /\[[^\[\]]+?\]/g;

  const textArr = s.split(r); // 字符串分割，返回一个数组
  const emojiArr = s.match(r); // 返回一个数组，成员是所有匹配的子字符串

  const a = []; // 定义返回的数组

  // 文字与表情 轮流添加到a
  // textArr 的长度 永远比 emojiArr 大 1
  // 当然 emojiArr 可能为 null，此时 textArr 长度为 1，成员即为原始字符串
  textArr.forEach((cont, i) => {
    // 当 文字内容不为空 添加到a
    cont && a.push({
      msgType: 'text',
      msgCont: cont
    });

    // 最后一次循环，肯定没有表情与之对应，所以忽略
    // 如果不是最后一次，添加表情到a
    // 当然此处还需判断是否有此表情的图片定义
    (i !== textArr.length - 1) && a.push(emojis[emojiArr[i]] ? ({
      msgType: 'emoji',
      msgCont: emojiArr[i],
      msgImage: emojiToPath(emojiArr[i])
    }) : ({
      msgType: 'text',
      msgCont: emojiArr[i]
    }));

  });

  return a;
}
```
