// 定义表情和图片的对应关系
const emojis = {
  '[微笑]': '100',
  '[撇嘴]': '101',
  '[色]': '102',
  '[发呆]': '103',
  '[得意]': '104',
  '[流泪]': '105',
  '[害羞]': '106',
  '[闭嘴]': '107',
  '[睡]': '108',
  '[大哭]': '109',
  '[尴尬]': '110',
  '[发怒]': '111',
  '[调皮]': '112',
  '[呲牙]': '113',
  '[惊讶]': '114',
  '[难过]': '115',
  '[酷]': '116',
  '[冷汗]': '117',
  '[抓狂]': '118',
  '[吐]': '119',
}

// 将表情文字转为图片
const emojiToPath = (i) => `/images/emojis/${emojis[i]}.gif`

// 将聊天内容转为一个文字和图片混合的列表
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

module.exports = {
  emojis,
  emojiToPath,
  textToEmoji,
}

